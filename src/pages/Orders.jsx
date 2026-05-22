import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("create_at", { ascending: false });
    const full = await Promise.all(
      (data || []).map(async (order) => {
        const { data: items } = await supabase
          .from("order_items")
          .select("*, products(*)")
          .eq("order_id", order.id);
        return { ...order, items: items || [] };
      })
    );
    setOrders(full);
  };

  const getStatusLabel = (status) => {
    if (status === "pending") return "Pending";
    if (status === "shipped") return "Shipping";
    if (status === "delivered") return "On the Way";
    if (status === "received") return "Transaction Successful";
    return status;
  };

  const markReceived = async (id, totalPrice, totalItems) => {
    const today = new Date().toISOString().split("T")[0];
    const { error } = await supabase.from("orders").update({ status: "received" }).eq("id", id);
    if (error) return console.log(error);
    const { data: existing } = await supabase.from("sales_summary").select("*").eq("date", today).maybeSingle();
    if (existing) {
      await supabase
        .from("sales_summary")
        .update({
          total_sales: Number(existing.total_sales) + Number(totalPrice),
          total_orders: Number(existing.total_orders) + 1,
          total_items_sold: Number(existing.total_items_sold) + Number(totalItems),
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("sales_summary").insert({
        date: today,
        total_sales: totalPrice,
        total_orders: 1,
        total_items_sold: totalItems,
      });
    }
    fetchOrders();
  };

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-5 mb-6 bg-white shadow-sm">
            <h3 className="text-xl font-semibold">Order #{order.id}</h3>
            <p className="mt-1">
              Status: <b className="capitalize text-red-600">{getStatusLabel(order.status)}</b>
            </p>
            <p>Total: ₱{order.total_price}</p>
            <p>Address: {order.address}</p>
            <hr className="my-3" />
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center mb-3">
                <img src={item.products.image} className="w-12 h-12 object-cover rounded" />
                <div>
                  {item.products.name} (x{item.quantity})
                </div>
              </div>
            ))}
            <p className="mt-2">
              Payment:{" "}
              <b>{order.payment_method === "card" ? "Debit/Credit Card" : "COD"}</b>
            </p>
            {order.payment_method === "card" && <p>Card: **** **** **** {order.card_number?.slice(-4)}</p>}
            <div className="flex gap-3 mt-4">
              {order.status === "delivered" && (
                <button
                  onClick={() =>
                    markReceived(
                      order.id,
                      order.total_price,
                      order.items.reduce((sum, item) => sum + item.quantity, 0)
                    )
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Order Received
                </button>
              )}
              <button
                onClick={() => navigate("/success", { state: { orderId: order.id } })}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
              >
                View Receipt
              </button>
            </div>
            {order.status === "received" && <p className="text-green-600 mt-2">✔ Transaction Successful</p>}
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;