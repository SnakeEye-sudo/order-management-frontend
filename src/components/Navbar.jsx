import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      location.pathname === path
        ? "bg-indigo-600 text-white"
        : "text-gray-600 hover:bg-indigo-50"
    }`;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/products" className="text-xl font-bold text-indigo-600">
          OrderHub
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/products" className={linkClass("/products")}>
            Products
          </Link>
          <Link to="/orders" className={linkClass("/orders")}>
            My Orders
          </Link>
          {isAdmin && (
            <Link to="/admin" className={linkClass("/admin")}>
              Admin
            </Link>
          )}
          <span className="text-sm text-gray-400 ml-2 hidden sm:inline">
            {user.username}
          </span>
          <button
            onClick={handleLogout}
            className="ml-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
