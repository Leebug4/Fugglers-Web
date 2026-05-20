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

        return {
          ...order,
          items: items || [],
        };
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

    const { error } = await supabase
      .from("orders")
      .update({ status: "received" })
      .eq("id", id);

    if (error) return console.log(error);

    const { data: existing } = await supabase
      .from("sales_summary")
      .select("*")
      .eq("date", today)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("sales_summary")
        .update({
          total_sales: Number(existing.total_sales) + Number(totalPrice),
          total_orders: Number(existing.total_orders) + 1,
          total_items_sold:
            Number(existing.total_items_sold) + Number(totalItems),
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
    <div style={{ padding: 20 }}>
      <h2>My Orders</h2>

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ddd",
            padding: 15,
            marginBottom: 10,
          }}
        >
          <h3>Order #{order.id}</h3>

          <p>
            Status: <b>{getStatusLabel(order.status)}</b>
          </p>

          <p>Total: ₱{order.total_price}</p>
          <p>Address: {order.address}</p>

          {/* ITEMS */}
          <hr />
          {order.items.map((item) => (
            <div
              key={item.id}
              style={{ display: "flex", gap: 10, marginBottom: 10 }}
            >
              <img
                src={item.products.image}
                style={{ width: 50, height: 50 }}
              />
              <div>
                {item.products.name} (x{item.quantity})
              </div>
            </div>
          ))}

          {/* PAYMENT INFO */}
          <p style={{ marginTop: 10 }}>
            Payment:{" "}
            <b>
              {order.payment_method === "card"
                ? "Debit/Credit Card"
                : "COD"}
            </b>
          </p>

          {order.payment_method === "card" && (
            <p>
              Card: **** **** ****{" "}
              {order.card_number?.slice(-4)}
            </p>
          )}

          {/* ACTIONS SEPARATED */}
          <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
            {order.status === "delivered" && (
              <button
                onClick={() =>
                  markReceived(
                    order.id,
                    order.total_price,
                    order.items.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )
                  )
                }
                style={{
                  padding: "8px 12px",
                  background: "green",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                }}
              >
                Order Received
              </button>
            )}

            {/* ALWAYS AVAILABLE */}
            <button
              onClick={() =>
                navigate("/success", {
                  state: { orderId: order.id },
                })
              }
              style={{
                padding: "8px 12px",
                background: "black",
                color: "white",
                border: "none",
                borderRadius: 6,
              }}
            >
              View Receipt
            </button>
          </div>

          {order.status === "received" && (
            <p style={{ color: "green", marginTop: 10 }}>
              ✔ Transaction Successful
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default Orders;