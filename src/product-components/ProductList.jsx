import { useState, useEffect } from "react";
import { deleteProduct, getAllProducts } from "./productApi";
import UseToast from "./UseToast";

const ProductList = ({ onEdit, refresh }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showMessage, Toast } = UseToast();

  useEffect(() => {
    fetchProducts();
  }, [refresh]);

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
    <div className="px-4 sm:px-6 md:px-10 mt-8 max-w-4xl w-full">
      <Toast />
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
        📦 Product List
      </h2>

      {loading ? (
        <p className="text-gray-500 text-sm">Products load ho rahe hain...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-400 text-sm">Koi product nahi mila.</p>
      ) : (
        <>
          {/* ✅ Desktop Table — md+ pe dikhega */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
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
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
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

          {/* ✅ Mobile Cards — sirf md se neeche dikhega */}
          <div className="flex flex-col gap-3 md:hidden">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-gray-200 rounded-xl p-3 flex gap-3 shadow-sm"
              >
                {/* Image */}
                {product.images?.[0]?.url ? (
                  <img
                    src={`http://localhost:8080${product.images[0].url}`}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
                    No img
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {product.category}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 line-through">
                      ₹{product.productPrice}
                    </span>
                    <span className="text-xs font-semibold text-green-600">
                      ₹{product.offerPrice}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="flex-1 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg text-xs font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-xs font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
