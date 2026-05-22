import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { addToCart } from "../utils/cart";
import Hero from "../components/Hero";

function Home() {
  const [showToast, setShowToast] = useState(false);
  const [banner, setBanner] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const showAddedToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

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

      <h2 className="text-2xl font-bold px-5 mt-8 mb-4">Featured Fugglers</h2>

      <div className="px-5 pb-8">
        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
              >
                {/* Product Image - Small and contained */}
                <div className="w-full h-32 bg-gray-50 rounded-md flex items-center justify-center mb-3 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>

                <h4 className="font-semibold text-gray-800 text-sm truncate">{p.name}</h4>
                <p className="text-red-600 font-bold text-base mt-1">₱{p.price}</p>
                
                <button
                  onClick={async () => {
                    await addToCart(p.id);
                    showAddedToast();
                  }}
                  className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors text-sm mt-3"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-5 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          ✅ Added to cart!
        </div>
      )}
    </div>
  );
}

export default Home;