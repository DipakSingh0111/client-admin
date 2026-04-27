import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://admin-backend-red.vercel.app/api";

const StatCard = ({ title, value, icon, loading }) => (
  <div className="bg-white p-5 rounded-xl shadow">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <span className="text-2xl">{icon}</span>
    </div>
    {loading ? (
      <div className="h-7 w-24 bg-gray-100 animate-pulse rounded mt-1" />
    ) : (
      <p className="text-xl font-bold text-gray-800">{value}</p>
    )}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  // 👇 NEW STATE
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    // 👇 GET ADMIN FROM LOCALSTORAGE
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
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* 👇 ADMIN NAME SHOW */}
      <p className="text-gray-600 mt-2">
        Welcome back 👋 {admin?.username || "Admin"}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
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
