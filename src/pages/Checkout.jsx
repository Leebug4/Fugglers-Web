import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState("");

  // PAYMENT
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cardNumber, setCardNumber] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const selectedIds =
      JSON.parse(localStorage.getItem("selectedCartItems")) || [];

    const { data, error } = await supabase
      .from("cart")
      .select("*, products(*)")
      .eq("user_id", user.id);

    if (error) {
      console.log("CART ERROR:", error);
      return;
    }

    const filtered = (data || []).filter((item) =>
      selectedIds.includes(item.id)
    );

    setCartItems(filtered);
  };

  const shippingFee = 60;

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + item.products.price * item.quantity;
  }, 0);

  const grandTotal = subtotal + shippingFee;

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const selectedIds =
      JSON.parse(localStorage.getItem("selectedCartItems")) || [];

    if (!user) {
      alert("User not found");
      return;
    }

    if (!address) {
      alert("Please enter your address");
      return;
    }

    if (paymentMethod === "card" && !cardNumber) {
      alert("Please enter card number");
      return;
    }

    // SAFE PAYMENT VALUE
    const cleanPaymentMethod =
      paymentMethod === "card" ? "card" : "cod";

    console.log("PAYMENT METHOD:", cleanPaymentMethod);

    // ================= CREATE ORDER =================
    const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total_price: grandTotal,
      status: "pending",
      address,
      payment_method: cleanPaymentMethod,
      card_number:cleanPaymentMethod === "card" ? cardNumber : "Cash on Delivery",
    })
    .select()
    .single();

    if (error) {
      console.log("ORDER ERROR:", error);
      return;
    }

    if (!order?.id) {
      console.log("ORDER NULL:", order);
      return;
    }

    // ================= ORDER ITEMS =================
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.products.price,
    }));

    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (orderItemsError) {
      console.log("ORDER ITEMS ERROR:", orderItemsError);
      return;
    }

    // ================= CLEAR CART =================
    const { error: cartDeleteError } = await supabase
      .from("cart")
      .delete()
      .in("id", selectedIds);

    if (cartDeleteError) {
      console.log("CART DELETE ERROR:", cartDeleteError);
    }

    localStorage.removeItem("selectedCartItems");

    // ================= SALES TABLE INSERT (FIXED) =================
    const salesPayload = {
      order_id: order.id,
      user_id: user.id,
      total_amount: Number(grandTotal),
      payment_method: String(cleanPaymentMethod), // FORCE STRING
      status: "completed",
    };

    console.log("SALES PAYLOAD:", salesPayload);

    const { error: salesError } = await supabase
      .from("sales")
      .insert(salesPayload);

    if (salesError) {
      console.log("SALES ERROR:", salesError);
      return;
    }

    // ================= SUCCESS =================
    navigate("/success", {
      state: { orderId: order.id },
    });
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "auto" }}>
      <h2>Your Order Summary</h2>

      {/* HEADER */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 3fr 1fr 1fr",
          fontWeight: "bold",
          borderBottom: "1px solid #ddd",
          paddingBottom: 10,
        }}
      >
        <div>Product</div>
        <div>Details</div>
        <div>Qty</div>
        <div>Price</div>
      </div>

      {/* ITEMS */}
      {cartItems.map((item) => (
        <div
          key={item.id}
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 3fr 1fr 1fr",
            padding: "10px 0",
            borderBottom: "1px solid #eee",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            <img
              src={item.products.image}
              style={{ width: 60, height: 60 }}
            />
            <span>{item.products.name}</span>
          </div>

          <div style={{ fontSize: 12 }}>
            {item.products.description}
          </div>

          <div>{item.quantity}</div>

          <div>₱{item.products.price}</div>
        </div>
      ))}

      {/* ADDRESS */}
      <div style={{ marginTop: 30 }}>
        <h3>Shipping Address</h3>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: "100%", height: 80, padding: 10 }}
        />
      </div>

      {/* PAYMENT */}
      <div style={{ marginTop: 20 }}>
        <h3>Payment Method</h3>

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          style={{ padding: 8, width: "100%" }}
        >
          <option value="cod">Cash on Delivery (COD)</option>
          <option value="card">Debit / Credit Card</option>
        </select>

        {paymentMethod === "card" && (
          <input
            type="text"
            placeholder="Enter card number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            style={{
              marginTop: 10,
              width: "100%",
              padding: 10,
            }}
          />
        )}
      </div>

      {/* TOTAL */}
      <div style={{ marginTop: 20, textAlign: "right" }}>
        <p>Subtotal: ₱{subtotal}</p>
        <p>Shipping: ₱{shippingFee}</p>
        <h3>Total: ₱{grandTotal}</h3>
      </div>

      {/* BUTTONS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <button onClick={() => navigate("/cart")}>
          ← Back to Cart
        </button>

        <button
          disabled={cartItems.length === 0}
          onClick={handleSubmit}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

export default Checkout;