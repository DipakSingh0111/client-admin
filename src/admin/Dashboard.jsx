import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://admin-backend-red.vercel.app/api";

const StatCard = ({ title, value, icon, loading }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className="text-3xl flex-shrink-0">{icon}</div>
    <div className="min-w-0">
      <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wide truncate">
        {title}
      </h3>
      {loading ? (
        <div className="h-6 w-20 bg-gray-100 animate-pulse rounded mt-1" />
      ) : (
        <p className="text-lg font-bold text-gray-800 mt-0.5">{value}</p>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminInfo");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }

    const fetchStats = async () => {
      try {
        const [productsRes] = await Promise.all([
          axios.get(`${BASE_URL}/products`),
        ]);
        setStats({
          totalProducts: productsRes.data.total || 0,
          totalOrders: 0,
          revenue: 0,
        });
      } catch (err) {
        console.log("Dashboard stats fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back 👋{" "}
          <span className="font-medium text-gray-700">
            {admin?.username || "Admin"}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon="📦"
          loading={loading}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon="🛒"
          loading={loading}
        />
        <StatCard
          title="Revenue"
          value={`₹${stats.revenue.toLocaleString("en-IN")}`}
          icon="💰"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Dashboard;
