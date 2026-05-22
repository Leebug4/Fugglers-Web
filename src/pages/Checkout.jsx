import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cardNumber, setCardNumber] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    const selectedIds = JSON.parse(localStorage.getItem("selectedCartItems")) || [];
    const { data, error } = await supabase
      .from("cart")
      .select("*, products(*)")
      .eq("user_id", user.id);
    if (error) return;
    const filtered = (data || []).filter((item) => selectedIds.includes(item.id));
    setCartItems(filtered);
  };

  const shippingFee = 60;
  const subtotal = cartItems.reduce((sum, item) => sum + item.products.price * item.quantity, 0);
  const grandTotal = subtotal + shippingFee;

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const selectedIds = JSON.parse(localStorage.getItem("selectedCartItems")) || [];
    if (!user) return alert("User not found");
    if (!address) return alert("Please enter your address");
    if (paymentMethod === "card" && !cardNumber) return alert("Please enter card number");

    const cleanPaymentMethod = paymentMethod === "card" ? "card" : "cod";

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total_price: grandTotal,
        status: "pending",
        address,
        payment_method: cleanPaymentMethod,
        card_number: cleanPaymentMethod === "card" ? cardNumber : "Cash on Delivery",
      })
      .select()
      .single();

    if (error || !order?.id) return console.log("ORDER ERROR:", error);

    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.products.price,
    }));
    const { error: orderItemsError } = await supabase.from("order_items").insert(orderItems);
    if (orderItemsError) return console.log("ORDER ITEMS ERROR:", orderItemsError);

    await supabase.from("cart").delete().in("id", selectedIds);
    localStorage.removeItem("selectedCartItems");

    const salesPayload = {
      order_id: order.id,
      user_id: user.id,
      total_amount: Number(grandTotal),
      payment_method: String(cleanPaymentMethod),
      status: "completed",
    };
    const { error: salesError } = await supabase.from("sales").insert(salesPayload);
    if (salesError) console.log("SALES ERROR:", salesError);

    navigate("/success", { state: { orderId: order.id } });
  };

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Order Summary</h2>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No items selected.</p>
      ) : (
        <>
          <div className="grid grid-cols-[2fr,3fr,1fr,1fr] font-bold border-b pb-2 mb-2 text-gray-700">
            <div>Product</div>
            <div>Details</div>
            <div>Qty</div>
            <div>Price</div>
          </div>
          {cartItems.map((item) => (
            <div key={item.id} className="grid grid-cols-[2fr,3fr,1fr,1fr] py-3 border-b items-center">
              <div className="flex gap-2 items-center">
                <img src={item.products.image} className="w-12 h-12 object-cover rounded" />
                <span className="font-medium text-sm">{item.products.name}</span>
              </div>
              <div className="text-sm text-gray-600">{item.products.description}</div>
              <div>{item.quantity}</div>
              <div>₱{item.products.price}</div>
            </div>
          ))}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Shipping Address</h3>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="Enter your full address"
            />
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Payment Method</h3>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
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
                className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            )}
          </div>
          <div className="mt-6 text-right">
            <p className="text-gray-600">Subtotal: ₱{subtotal}</p>
            <p className="text-gray-600">Shipping: ₱{shippingFee}</p>
            <h3 className="text-2xl font-bold text-red-600">Total: ₱{grandTotal}</h3>
          </div>
          <div className="flex justify-between mt-8">
            <button
              onClick={() => navigate("/cart")}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
            >
              ← Back to Cart
            </button>
            <button
              disabled={cartItems.length === 0}
              onClick={handleSubmit}
              className={`px-6 py-2 rounded-md text-white transition ${
                cartItems.length ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Checkout;