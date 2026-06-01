import { useEffect, useState } from "react";
import { orderApi } from "../api/services";

const STEPS = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    orderApi
      .getAll()
      .then((res) => setOrders(res.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    if (!window.confirm("Cancel this order? Stock will be restored.")) return;
    await orderApi.cancel(id);
    load();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="space-y-5">
          {orders.map((o) => {
            const currentIndex = STEPS.indexOf(o.status);
            const cancelled = o.status === "CANCELLED";
            const canCancel = ["PENDING", "CONFIRMED"].includes(o.status);
            return (
              <div key={o.id} className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <span className="font-semibold text-gray-800">Order #{o.id}</span>
                    {o.createdAt && (
                      <span className="text-gray-400 text-sm ml-3">
                        {new Date(o.createdAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-indigo-600 text-lg">
                    {"$" + Number(o.totalAmount).toFixed(2)}
                  </span>
                </div>

                {cancelled ? (
                  <span className="inline-block bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full font-medium">
                    Cancelled
                  </span>
                ) : (
                  <div className="flex items-center">
                    {STEPS.map((step, i) => (
                      <div key={step} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium ${
                              i <= currentIndex
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {i + 1}
                          </div>
                          <span className="text-xs mt-1 text-gray-500">{step}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div
                            className={`flex-1 h-1 mx-1 rounded ${
                              i < currentIndex ? "bg-indigo-600" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {o.items && o.items.length > 0 && (
                  <div className="mt-4 border-t pt-3 text-sm text-gray-600 space-y-1">
                    {o.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{it.productName || `Product #${it.productId}`} x {it.quantity}</span>
                        {it.unitPrice != null && (
                          <span>{"$" + Number(it.unitPrice).toFixed(2)}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {canCancel && (
                  <button
                    onClick={() => cancel(o.id)}
                    className="mt-4 text-red-600 text-sm font-medium hover:underline"
                  >
                    Cancel order
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
