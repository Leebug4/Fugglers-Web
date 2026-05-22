import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { updateCart, removeItem } from "../utils/cart";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [footerOffset, setFooterOffset] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const loadCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    const { data, error } = await supabase
      .from("cart")
      .select("*, products(*)")
      .eq("user_id", user.id);
    if (!error) setCartItems(data || []);
  };

  const handleScroll = () => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const rect = footer.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setFooterOffset(window.innerHeight - rect.top);
    } else {
      setFooterOffset(0);
    }
  };

  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  const handleUpdate = async (productId, action) => {
    await updateCart(productId, action);
    loadCart();
  };

  const handleRemove = async (productId) => {
    await removeItem(productId);
    loadCart();
  };

  const total = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.products.price * item.quantity, 0);

  const handleCheckout = () => {
    localStorage.setItem("selectedCartItems", JSON.stringify(selectedItems));
    navigate("/checkout");
  };

  return (
    <div className="p-5 pb-32 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center py-10">Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm"
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleSelect(item.id)}
                className="w-5 h-5 mt-1"
              />
              <img
                src={item.products.image}
                alt={item.products.name}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.products.name}</h3>
                <p className="text-red-600 font-bold">₱{item.products.price}</p>
                <p className="text-gray-600">Qty: {item.quantity}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleUpdate(item.product_id, "minus")}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <button
                    onClick={() => handleUpdate(item.product_id, "plus")}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemove(item.product_id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          {/* Checkout Bar */}
          <div
            className="fixed left-0 right-0 bg-white border-t border-gray-300 flex justify-between items-center p-4 z-50 shadow-lg"
            style={{ bottom: footerOffset }}
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedItems.length === cartItems.length}
                onChange={toggleSelectAll}
                className="w-4 h-4"
              />
              <span className="text-sm">Select All</span>
            </label>
            <strong className="text-lg">Total: ₱{total}</strong>
            <button
              disabled={selectedItems.length === 0}
              onClick={handleCheckout}
              className={`px-5 py-2 rounded-md text-white transition ${
                selectedItems.length
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Checkout ({selectedItems.length})
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;