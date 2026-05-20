import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { addToCart } from "../utils/cart";
import { useSearchParams } from "react-router-dom";

function Products() {
  const [showToast, setShowToast] = useState(false);

  const showAddedToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    let query = supabase.from("products").select("*");

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (!error) setProducts(data);
    else console.log(error);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{category ? category : "All Products"}</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        {products.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ddd", padding: "10px" }}>
            <img src={p.image} width="100%" height="150" />
            <h4>{p.name}</h4>
            <p>₱{p.price}</p>

            <button
              onClick={async () => {
                await addToCart(p.id);
                showAddedToast();
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* ✅ TOAST OUTSIDE MAP */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            background: "#4CAF50",
            color: "white",
            padding: "12px 20px",
            borderRadius: 8,
            zIndex: 9999,
          }}
        >
          Added to cart ✅
        </div>
      )}
    </div>
  );
}

export default Products;