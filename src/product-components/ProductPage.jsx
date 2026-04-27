import { useState } from "react";
import AddProduct from "./AddProduct.jsx";
import EditProduct from "./EditProduct.jsx";
import ProductList from "./ProductList.jsx";

const ProductPage = () => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const triggerRefresh = () => setRefresh((prev) => prev + 1);

  return (
    <div className="min-h-screen bg-white">
      {/* Add ya Edit form — ek time pe ek hi dikhega */}
      {editingProduct ? (
        <EditProduct
          product={editingProduct}
          onCancel={() => setEditingProduct(null)}
          onUpdated={() => {
            setEditingProduct(null);
            triggerRefresh();
          }}
        />
      ) : (
        <AddProduct onProductAdded={triggerRefresh} />
      )}

      {/* Product list — hamesha visible */}
      <ProductList
        onEdit={(product) => {
          setEditingProduct(product);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        refresh={refresh}
      />
    </div>
  );
};

export default ProductPage;
