import { useLocation, useNavigate } from "react-router-dom";
import EditProduct from "../product-components/EditProduct";

const EditProductPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Agar directly URL pe aao aur state na ho
  if (!state?.product) {
    return (
      <div className="p-10 text-gray-500">
        Product nahi mila.{" "}
        <span
          className="text-indigo-600 cursor-pointer underline"
          onClick={() => navigate("/admin/product-list")}
        >
          Product List pe wapas jao
        </span>
      </div>
    );
  }

  return (
    <EditProduct
      product={state.product}
      onCancel={() => navigate("/admin/product-list")}
      onUpdated={() => navigate("/admin/product-list")}
    />
  );
};

export default EditProductPage;
