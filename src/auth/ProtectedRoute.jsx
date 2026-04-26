import { Navigate } from "react-router-dom";

// Agar token nahi hai to login page pe redirect karega
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
