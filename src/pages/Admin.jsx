import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Admin() {
  const [orders, setOrders] = useState([]);

  const [summary, setSummary] = useState({
    totalSales: 0,
    totalOrders: 0,
    pending: 0,
    shipped: 0,
    delivered: 0,
    received: 0,
  });

  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    await fetchOrders();
    await fetchSummary();
    await fetchTopProducts();
  };

  // 📦 ORDERS
  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("create_at", { ascending: false });

    const enriched = await Promise.all(
      (data || []).map(async (order) => {
        const { data: items } = await supabase
          .from("order_items")
          .select("*, products(*)")
          .eq("order_id", order.id);

        return { ...order, items: items || [] };
      })
    );

    setOrders(enriched);
  };

  // 💰 SUMMARY (REMOVED on_the_way)
  const fetchSummary = async () => {
    const { data } = await supabase
      .from("orders")
      .select("total_price, status");

    const totalSales = (data || [])
      .filter(o => o.status === "received")
      .reduce((sum, o) => sum + Number(o.total_price), 0);

    const count = (status) =>
      (data || []).filter(o => o.status === status).length;

    setSummary({
      totalSales,
      totalOrders: data?.length || 0,
      pending: count("pending"),
      shipped: count("shipped"),
      delivered: count("delivered"),
      received: count("received"),
    });
  };

  // 📊 TOP PRODUCTS
  const fetchTopProducts = async () => {
    const { data } = await supabase
      .from("order_items")
      .select("product_id, quantity, products(*)");

    const map = {};

    (data || []).forEach((item) => {
      const id = item.product_id;

      if (!map[id]) {
        map[id] = {
          name: item.products?.name,
          image: item.products?.image,
          sold: 0,
        };
      }

      map[id].sold += item.quantity;
    });

    setTopProducts(Object.values(map));
  };

  // 🔄 UPDATE STATUS
  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.log("UPDATE ERROR:", error);
      return;
    }

    fetchAll();
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Admin Dashboard</h1>
      <button
        onClick={() => window.location.href = "/sales-summary"}
        style={{
          marginTop: 30,
          padding: "10px 15px",
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        📊 View Sales Summary
      </button>
      {/* 📊 SUMMARY */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Box title="Total Sales" value={`₱${summary.totalSales}`} />
        <Box title="Orders" value={summary.totalOrders} />
        <Box title="Pending" value={summary.pending} />
        <Box title="Shipped" value={summary.shipped} />
        <Box title="Delivered" value={summary.delivered} />
        <Box title="Received" value={summary.received} />
      </div>

      {/* 🔥 TOP PRODUCTS */}
      <h2 style={{ marginTop: 30 }}>🔥 Top Products</h2>

      <div style={{ display: "flex", gap: 10 }}>
        {topProducts.map((p, i) => (
          <div key={i} style={card}>
            <img src={p.image} width={60} />
            <p>{p.name}</p>
            <b>Sold: {p.sold}</b>
          </div>
        ))}
      </div>

      {/* 📦 ORDERS */}
      <h2 style={{ marginTop: 30 }}>Orders</h2>

      {orders.map((order) => (
        <div key={order.id} style={orderCard}>
          <h3>Order #{order.id}</h3>

          <p>Total: ₱{order.total_price}</p>

          <p>
            Status: <b>{order.status}</b>
          </p>

          <p>Address: {order.address}</p>

          {/* ITEMS */}
          {order.items.map((item) => (
            <div key={item.id} style={{ display: "flex", gap: 10 }}>
              <img src={item.products.image} width={40} />
              <div>
                {item.products.name} (x{item.quantity})
              </div>
            </div>
          ))}

          {/* ACTIONS */}
          {order.status !== "received" && (
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <button onClick={() => updateStatus(order.id, "pending")}>
                Pending
              </button>

              <button onClick={() => updateStatus(order.id, "shipped")}>
                Shipped
              </button>

              <button onClick={() => updateStatus(order.id, "delivered")}>
                Delivered
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// UI
const Box = ({ title, value }) => (
  <div style={{ border: "1px solid #ddd", padding: 10 }}>
    <h4>{title}</h4>
    <h2>{value || 0}</h2>
  </div>
);

const card = {
  border: "1px solid #ddd",
  padding: 10,
};

const orderCard = {
  border: "1px solid #ccc",
  padding: 15,
  marginTop: 10,
};

export default Admin;