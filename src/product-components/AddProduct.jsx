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
      onProductAdded?.(); // parent ko notify karo list refresh karne ke liye
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
    <div className="py-10 bg-white">
      <Toast />
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <h2 className="text-xl font-semibold text-gray-800">
          ➕ Naya Product Add Karo
        </h2>

        {/* Images */}
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <div key={index} className="relative">
                  <label htmlFor={`image${index}`} className="cursor-pointer">
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
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            name="name"
            type="text"
            placeholder="Type here"
            value={formData.name}
            onChange={handleChange}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            name="description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Category */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="category">
            Category
          </label>
          <select
            id="category"
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
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              name="productPrice"
              type="number"
              placeholder="0"
              value={formData.productPrice}
              onChange={handleChange}
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              name="offerPrice"
              type="number"
              placeholder="0"
              value={formData.offerPrice}
              onChange={handleChange}
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 bg-indigo-500 cursor-pointer hover:bg-indigo-600 text-white font-medium rounded disabled:opacity-60 transition-colors"
        >
          {loading ? "Adding..." : "ADD"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
