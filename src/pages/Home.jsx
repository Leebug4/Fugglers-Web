import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { addToCart } from "../utils/cart";
import Hero from "../components/Hero";

function Home() {
  const [showToast, setShowToast] = useState(false);

  const showAddedToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const [banner, setBanner] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBanner = async () => {
    const { data, error } = await supabase
      .from("banner")
      .select("image")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (!error) setBanner(data.image);
  };

  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("id, name, price, image, description, category")
      .limit(4);

    if (!error) setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    fetchBanner();
  }, []);

  return (
    <div>
      <Hero bannerImage={banner} />

      <h2 style={{ paddingLeft: "20px" }}>Featured Fugglers</h2>

      <div style={{ padding: "20px" }}>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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
        )}
      </div>

      {/* ✅ TOAST OUTSIDE EVERYTHING */}
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

export default Home;