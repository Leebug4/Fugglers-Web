import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!orderId) return;
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    const { data: orderData } = await supabase.from("orders").select("*").eq("id", orderId).single();
    setOrder(orderData);
    const { data: itemsData } = await supabase.from("order_items").select("*, products(*)").eq("order_id", orderId);
    setItems(itemsData || []);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!orderId) {
    return (
      <div className="p-5 text-center">
        <h2 className="text-2xl font-bold">No order found</h2>
        <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
          Go Home
        </button>
      </div>
    );
  }
  if (!order) {
    return <div className="p-5 text-center text-gray-500">Loading order...</div>;
  }

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-2">Thank you for your Furrychase!</h1>
      <p className="mb-6 text-gray-600">Your order has been placed successfully.</p>
      <hr className="my-4" />
      <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
      {items.map((item) => (
        <div key={item.id} className="flex gap-4 mb-4 border-b pb-4">
          <img src={item.products.image} className="w-20 h-20 object-cover rounded" />
          <div>
            <h4 className="text-lg font-bold">{item.products.name}</h4>
            <p>Qty: {item.quantity}</p>
            <p>₱{item.price}</p>
            <p>Subtotal: ₱{item.price * item.quantity}</p>
          </div>
        </div>
      ))}
      <hr className="my-4" />
      <h3 className="text-2xl font-bold text-red-600">Total Amount Paid: ₱{total}</h3>
      <hr className="my-4" />
      <h2 className="text-2xl font-semibold mb-2">Delivery Information</h2>
      <p><b>Address:</b> {order.address}</p>
      <p><b>Payment Method:</b> {order.payment_method === "card" ? "Card Payment" : "COD"}</p>
      {order.payment_method === "card" && <p>Card: **** {order.card_number?.slice(-4)}</p>}
      <button onClick={() => navigate("/")} className="mt-6 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
        Back to Home
      </button>
    </div>
  );
}

export default Success;