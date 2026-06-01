import { useEffect, useState } from "react";
import { productApi, orderApi } from "../api/services";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({});
  const [sortDir, setSortDir] = useState("asc");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const loadProducts = () => {
    setLoading(true);
    productApi
      .getAll(0, 50, "price", sortDir)
      .then((res) => {
        const data = res.data.data;
        setProducts(data.content || data || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortDir]);

  const addToCart = (id) =>
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));

  const removeFromCart = (id) =>
    setCart((c) => {
      const next = { ...c };
      if (next[id] > 1) next[id] -= 1;
      else delete next[id];
      return next;
    });

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const placeOrder = async () => {
    const items = Object.entries(cart).map(([productId, quantity]) => ({
      productId: Number(productId),
      quantity,
    }));
    try {
      await orderApi.place(items);
      setCart({});
      setToast("Order placed successfully!");
      loadProducts();
      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      const msg =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Could not place order";
      setToast(msg);
      setTimeout(() => setToast(""), 4000);
    }
  };

  const visible = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Product Catalog</h1>
        <div className="flex gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <select
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 outline-none"
          >
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md p-5 animate-pulse h-48" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visible.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-md p-5 flex flex-col hover:shadow-xl transition"
            >
              <h3 className="font-semibold text-lg text-gray-800">{p.name}</h3>
              <p className="text-gray-500 text-sm mb-3 flex-1">
                {p.description || "No description"}
              </p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-indigo-600 font-bold text-xl">
                  {"$" + Number(p.price).toFixed(2)}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    p.stockQuantity > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {p.stockQuantity > 0 ? `In stock: ${p.stockQuantity}` : "Out of stock"}
                </span>
              </div>
              {cart[p.id] ? (
                <div className="flex items-center justify-between bg-indigo-50 rounded-lg p-1">
                  <button
                    onClick={() => removeFromCart(p.id)}
                    className="w-9 h-9 rounded-lg bg-white text-indigo-600 font-bold hover:bg-indigo-100"
                  >
                    -
                  </button>
                  <span className="font-medium">{cart[p.id]}</span>
                  <button
                    onClick={() => addToCart(p.id)}
                    disabled={cart[p.id] >= p.stockQuantity}
                    className="w-9 h-9 rounded-lg bg-white text-indigo-600 font-bold hover:bg-indigo-100 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(p.id)}
                  disabled={p.stockQuantity === 0}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 transition"
                >
                  Add to cart
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {cartCount > 0 && (
        <button
          onClick={placeOrder}
          className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 font-medium"
        >
          Place order ({cartCount} {cartCount === 1 ? "item" : "items"})
        </button>
      )}

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg text-sm">
          {toast}
        </div>
      )}
    </div>
  );
}
