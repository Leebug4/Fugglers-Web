import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { addToCart } from "../utils/cart";
import { useSearchParams } from "react-router-dom";

function Products() {
  const [showToast, setShowToast] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  const showAddedToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    let query = supabase.from("products").select("*");
    if (category) query = query.eq("category", category);
    const { data, error } = await query;
    if (!error) setProducts(data);
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-6">{category ? category : "All Products"}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
          >
            <div className="w-full h-32 bg-gray-50 rounded-md flex items-center justify-center mb-3 overflow-hidden">
              <img src={p.image} alt={p.name} className="w-full h-full object-contain p-2" />
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
      {showToast && (
        <div className="fixed top-20 right-5 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg z-50">
          ✅ Added to cart!
        </div>
      )}
    </div>
  );
}

export default Products;