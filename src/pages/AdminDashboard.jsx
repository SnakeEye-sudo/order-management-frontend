import { useEffect, useState } from "react";
import { productApi, orderApi } from "../api/services";

const STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];
const emptyForm = { name: "", description: "", price: "", stockQuantity: "" };

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState("");

  const loadAll = () => {
    productApi.getAll(0, 100).then((res) => {
      const d = res.data.data;
      setProducts(d.content || d || []);
    });
    orderApi.getAll().then((res) => setOrders(res.data.data || []));
  };

  useEffect(() => {
    loadAll();
  }, []);

  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submitProduct = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      stockQuantity: parseInt(form.stockQuantity, 10),
    };
    try {
      if (editingId) {
        await productApi.update(editingId, payload);
        flash("Product updated");
      } else {
        await productApi.create(payload);
        flash("Product created");
      }
      setForm(emptyForm);
      setEditingId(null);
      loadAll();
    } catch (err) {
      flash((err.response && err.response.data && err.response.data.message) || "Save failed");
    }
  };

  const editProduct = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      stockQuantity: p.stockQuantity,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await productApi.remove(id);
    loadAll();
  };

  const changeStatus = async (id, status) => {
    await orderApi.updateStatus(id, status);
    loadAll();
    flash("Order status updated");
  };

  const revenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  const lowStock = products.filter((p) => p.stockQuantity < 5).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {msg && (
        <div className="mb-4 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm">
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500 text-sm">Revenue</p>
          <p className="text-2xl font-bold text-green-600">
            {"$" + revenue.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500 text-sm">Low Stock (&lt; 5)</p>
          <p className="text-2xl font-bold text-orange-500">{lowStock}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "Edit Product" : "Add Product"}
        </h2>
        <form onSubmit={submitProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Product name"
            className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            value={form.price}
            onChange={handleChange}
            required
            placeholder="Price"
            className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="stockQuantity"
            type="number"
            min="0"
            value={form.stockQuantity}
            onChange={handleChange}
            required
            placeholder="Stock quantity"
            className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700"
            >
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                className="px-5 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Price</th>
                <th className="py-2">Stock</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="py-3">{p.name}</td>
                  <td className="py-3">{"$" + Number(p.price).toFixed(2)}</td>
                  <td className="py-3">{p.stockQuantity}</td>
                  <td className="py-3 space-x-3">
                    <button onClick={() => editProduct(p)} className="text-indigo-600 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => removeProduct(p.id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Order</th>
                <th className="py-2">User</th>
                <th className="py-2">Total</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="py-3">#{o.id}</td>
                  <td className="py-3">{o.username}</td>
                  <td className="py-3">{"$" + Number(o.totalAmount).toFixed(2)}</td>
                  <td className="py-3">
                    {o.status === "CANCELLED" ? (
                      <span className="text-red-600 font-medium">CANCELLED</span>
                    ) : (
                      <select
                        value={o.status}
                        onChange={(e) => changeStatus(o.id, e.target.value)}
                        className="border border-gray-300 rounded-lg px-2 py-1 outline-none"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
