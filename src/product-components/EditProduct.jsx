import { useState } from "react";

import { updateProduct } from "./productApi";
import UseToast from "./UseToast";
// import { updateProduct } from "./productApi.js";

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Accessories",
  "Food",
  "Books",
  "Sports",
  "Other",
];

// Props:
//   product  — jo product edit karna hai (required)
//   onCancel — cancel button ka callback
//   onUpdated — update hone ke baad callback (list refresh ke liye)

const EditProduct = ({ product, onCancel, onUpdated }) => {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    category: product.category,
    productPrice: product.productPrice,
    offerPrice: product.offerPrice,
  });
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

      await updateProduct(product._id, fd);
      showMessage("Product Updated successfully.");
      onUpdated?.();
    } catch (err) {
      showMessage(
        err.response?.data?.message ||
          "Failed to update product. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 bg-white">
      <Toast />
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <h2 className="text-xl font-semibold text-gray-800">
          ✏️ Product Update Karo
        </h2>

        {/* Images — existing images preview + new upload */}
        <div>
          <p className="text-base font-medium">Product Image</p>
          {/* Existing images */}
          {product.images?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 mb-1">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={`http://localhost:8080${img.url}`}
                  alt="existing"
                  className="w-16 h-16 object-cover rounded border border-gray-200 opacity-60"
                />
              ))}
              <p className="w-full text-xs text-gray-400">
                ↑ Purani images (naye upload karoge toh replace ho jayengi)
              </p>
            </div>
          )}
          {/* New uploads */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <div key={index} className="relative">
                  <label
                    htmlFor={`edit-image${index}`}
                    className="cursor-pointer"
                  >
                    <input
                      accept="image/*"
                      type="file"
                      id={`edit-image${index}`}
                      hidden
                      onChange={(e) =>
                        handleImageChange(index, e.target.files[0])
                      }
                    />
                    {previews[index] ? (
                      <img
                        className="max-w-24 h-24 object-cover rounded border border-gray-300"
                        src={previews[index]}
                        alt={`preview${index}`}
                      />
                    ) : (
                      <img
                        className="max-w-24 cursor-pointer"
                        src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"
                        alt="uploadArea"
                        width={100}
                        height={100}
                      />
                    )}
                  </label>
                  {previews[index] && (
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Product Name</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Product Description</label>
          <textarea
            name="description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Category */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
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

        {/* Prices */}
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Product Price</label>
            <input
              name="productPrice"
              type="number"
              value={formData.productPrice}
              onChange={handleChange}
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Offer Price</label>
            <input
              name="offerPrice"
              type="number"
              value={formData.offerPrice}
              onChange={handleChange}
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded disabled:opacity-60 transition-colors"
          >
            {loading ? "Updating..." : "UPDATE"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
