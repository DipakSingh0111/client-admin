import { Link, useLocation, useNavigate } from "react-router-dom";

const navLinks = [
  { path: "/admin", label: "Dashboard", icon: "📊" },
  { path: "/admin/add-product", label: "Add Product", icon: "➕" },
  { path: "/admin/product-list", label: "Product List", icon: "📦" },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
      pathname === path
        ? "bg-indigo-600 text-white"
        : "text-gray-300 hover:bg-gray-700"
    }`;

  return (
    <div className="w-64 bg-gray-900 text-white p-5 min-h-screen flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          {navLinks.map(({ path, label, icon }) => (
            <Link key={path} to={path} className={linkClass(path)}>
              <span>{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout — neeche rahega */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors w-full"
      >
        <span>🚪</span>
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
