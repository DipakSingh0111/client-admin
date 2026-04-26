import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductList from "../product-components/ProductList";
// import ProductList from "./product-components/ProductList.jsx";

// Edit button dabane par /admin/edit-product/:id pe redirect karega
const ProductListPage = () => {
  const [refresh] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="py-10">
      <ProductList
        onEdit={(product) =>
          navigate(`/admin/edit-product/${product._id}`, { state: { product } })
        }
        refresh={refresh}
      />
    </div>
  );
};

export default ProductListPage;
