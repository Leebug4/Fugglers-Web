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
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
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

  // ✅ FIXED CHECKOUT NAVIGATION
  const handleCheckout = () => {
    localStorage.setItem(
      "selectedCartItems",
      JSON.stringify(selectedItems)
    );

    navigate("/checkout");
  };

  return (
    <div style={{ paddingBottom: "120px" }}>
      <h1>Your Cart</h1>

      {cartItems.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            gap: 15,
            marginBottom: 15,
            border: "1px solid #ddd",
            padding: 10,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <input
            type="checkbox"
            checked={selectedItems.includes(item.id)}
            onChange={() => toggleSelect(item.id)}
          />

          <img
            src={item.products.image}
            style={{
              width: 100,
              height: 100,
              objectFit: "cover",
            }}
          />

          <div>
            <h3>{item.products.name}</h3>
            <p>₱{item.products.price}</p>
            <p>Qty: {item.quantity}</p>

            <button onClick={() => handleUpdate(item.product_id, "minus")}>-</button>
            <button onClick={() => handleUpdate(item.product_id, "plus")}>+</button>
            <button onClick={() => handleRemove(item.product_id)}>Remove</button>
          </div>
        </div>
      ))}

      {/* CHECKOUT BAR */}
      {cartItems.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: footerOffset,
            left: 0,
            right: 0,
            background: "white",
            borderTop: "1px solid #ddd",
            display: "flex",
            justifyContent: "space-between",
            padding: "15px 20px",
            zIndex: 9999,
          }}
        >
          <div>
            <input
              type="checkbox"
              checked={selectedItems.length === cartItems.length}
              onChange={toggleSelectAll}
            />
            Select All
          </div>

          <strong>Total: ₱{total}</strong>

          <button
            disabled={selectedItems.length === 0}
            onClick={handleCheckout}
            style={{
              padding: "10px 20px",
              background: selectedItems.length ? "black" : "#ccc",
              color: "white",
            }}
          >
            Checkout ({selectedItems.length})
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;