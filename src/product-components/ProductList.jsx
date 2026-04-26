import { useState, useEffect } from "react";
import useToast from "./useToast";
import { deleteProduct, getAllProducts } from "./productApi";
// import { getAllProducts, deleteProduct } from "./productApi.js";
// import useToast from "./useToast.js";

const ProductList = ({ onEdit, refresh }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showMessage, Toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, [refresh]); // refresh prop badlega toh dobara fetch hoga

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await getAllProducts();
      setProducts(data.data || []);
    } catch (err) {
      console.log(err);
      showMessage("Error fetching products. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone.",
      )
    )
      return;
    try {
      await deleteProduct(id);
      showMessage("Product delete ho gaya! ✓");
      fetchProducts();
    } catch (err) {
      showMessage(
        err.response?.data?.message ||
          "Failed to delete product. Please try again.",
        "error",
      );
    }
  };

  return (
    <div className="md:px-10 px-4 mt-8 max-w-4xl w-full">
      <Toast />
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        📦 Product List
      </h2>

      {loading ? (
        <p className="text-gray-500 text-sm">Products load ho rahe hain...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-400 text-sm">Koi product nahi mila.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Offer</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {product.images?.[0]?.url ? (
                      <img
                        src={`http://localhost:8080${product.images[0].url}`}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                        No img
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-[160px] truncate">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {product.category}
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    ₹{product.productPrice}
                  </td>
                  <td className="px-4 py-3 text-green-600">
                    ₹{product.offerPrice}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded text-xs font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded text-xs font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
