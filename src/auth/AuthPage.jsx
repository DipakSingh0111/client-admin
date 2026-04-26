import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, registerApi } from "./authApi.js";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        const { data } = await loginApi({
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("adminToken", data.token);
      } else {
        const { data } = await registerApi(formData);
        localStorage.setItem("adminToken", data.token);
      }
      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid Credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          {isLogin ? "Admin Login" : "Admin Register"}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {isLogin ? "" : "Create a new admin account to manage the dashboard."}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Register only fields */}
          {!isLogin && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Username
                </label>
                <input
                  name="username"
                  type="text"
                  placeholder="Admin username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Mobile
                </label>
                <input
                  name="mobile"
                  type="tel"
                  placeholder="Mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-indigo-500 text-sm"
                />
              </div>
            </>
          )}

          {/* Common fields */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-5">
          {isLogin ? "Naya account chahiye?" : "Pehle se account hai?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-indigo-600 cursor-pointer font-medium hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
