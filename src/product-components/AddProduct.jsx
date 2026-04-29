import { useState } from "react";
import { addProduct } from "./productApi.js";
import UseToast from "./UseToast.jsx";

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Accessories",
  "Food",
  "Books",
  "Sports",
  "Other",
];

const emptyForm = {
  name: "",
  description: "",
  category: "",
  productPrice: "",
  offerPrice: "",
};

const AddProduct = ({ onProductAdded }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [images, setImages] = useState([null, null, null, null]);
  const [previews, setPreviews] = useState([null, null, null, null]);
  const [loading, setLoading] = useState(false);
  const { showMessage, Toast } = UseToast();

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (index, file) => {
    if (!file) return;
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages[index] = file;
    newPreviews[index] = URL.createObjectURL(file);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages[index] = null;
    newPreviews[index] = null;
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, val]) => fd.append(key, val));
      images.forEach((img) => {
        if (img) fd.append("images", img);
      });

      await addProduct(fd);
      showMessage("Product Added successfully.");
      setFormData(emptyForm);
      setImages([null, null, null, null]);
      setPreviews([null, null, null, null]);
      onProductAdded?.();
    } catch (err) {
      showMessage(
        err.response?.data?.message ||
          "Failed to add product. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
      <Toast />
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-100">
          ➕ Add New Product.
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Images */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Product Images
            </p>
            {/* ✅ grid pe switch — mobile pe 4 columns easily fit ho jaati hain */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {Array(4)
                .fill("")
                .map((_, index) => (
                  <div key={index} className="relative aspect-square">
                    <label
                      htmlFor={`image${index}`}
                      className="cursor-pointer block w-full h-full"
                    >
                      <input
                        accept="image/*"
                        type="file"
                        id={`image${index}`}
                        hidden
                        onChange={(e) =>
                          handleImageChange(index, e.target.files[0])
                        }
                      />
                      {previews[index] ? (
                        <img
                          className="w-full h-full object-cover rounded-lg border border-gray-200"
                          src={previews[index]}
                          alt={`preview${index}`}
                        />
                      ) : (
                        <div className="w-full h-full rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                          <span className="text-2xl text-gray-300">+</span>
                          <span className="text-xs text-gray-400 mt-1 hidden sm:block">
                            Upload
                          </span>
                        </div>
                      )}
                    </label>
                    {previews[index] && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow-sm"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="product-name"
            >
              Product Name
            </label>
            <input
              id="product-name"
              name="name"
              type="text"
              placeholder="Type here"
              value={formData.name}
              onChange={handleChange}
              className="outline-none py-2.5 px-3 rounded-lg border border-gray-300 focus:border-indigo-400 text-sm transition-colors w-full"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="product-description"
            >
              Product Description
            </label>
            <textarea
              id="product-description"
              name="description"
              rows={4}
              className="outline-none py-2.5 px-3 rounded-lg border border-gray-300 focus:border-indigo-400 resize-none text-sm transition-colors w-full"
              placeholder="Type here"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="category"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="outline-none py-2.5 px-3 rounded-lg border border-gray-300 focus:border-indigo-400 text-sm transition-colors w-full bg-white"
              required
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Prices — mobile pe full width stack, sm+ pe side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="product-price"
              >
                Product Price (₹)
              </label>
              <input
                id="product-price"
                name="productPrice"
                type="number"
                placeholder="0"
                value={formData.productPrice}
                onChange={handleChange}
                className="outline-none py-2.5 px-3 rounded-lg border border-gray-300 focus:border-indigo-400 text-sm transition-colors w-full"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="offer-price"
              >
                Offer Price (₹)
              </label>
              <input
                id="offer-price"
                name="offerPrice"
                type="number"
                placeholder="0"
                value={formData.offerPrice}
                onChange={handleChange}
                className="outline-none py-2.5 px-3 rounded-lg border border-gray-300 focus:border-indigo-400 text-sm transition-colors w-full"
                required
              />
            </div>
          </div>

          {/* ✅ Submit button — mobile pe full width */}
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-2.5 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-60 transition-colors cursor-pointer"
          >
            {loading ? "Adding..." : "ADD PRODUCT"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
