// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import AddProduct from "./product-components/AddProduct";
import AuthPage from "./auth/AuthPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import ProductListPage from "./admin/Productlistpage";
import EditProductPage from "./admin/EditProductPage";

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<AuthPage />} />

      {/* Root pe aao to /admin redirect */}
      <Route path="/" element={<Navigate to="/admin" replace />} />

      {/* Protected admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-product"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AddProduct />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/product-list"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <ProductListPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/edit-product/:id"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <EditProductPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
