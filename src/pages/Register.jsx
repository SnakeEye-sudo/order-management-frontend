import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/services";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await authApi.register(form);
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const msg =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Create account</h1>
          <p className="text-gray-500 text-sm mt-1">Join OrderHub today</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 text-sm px-4 py-2 rounded-lg">
            {success}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            minLength={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="3-50 characters"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="At least 6 characters"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-indigo-300 transition"
        >
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
