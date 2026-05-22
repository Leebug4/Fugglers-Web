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

  const fetchSummary = async () => {
    const { data } = await supabase.from("orders").select("total_price, status");
    const totalSales = (data || [])
      .filter((o) => o.status === "received")
      .reduce((sum, o) => sum + Number(o.total_price), 0);
    const count = (status) => (data || []).filter((o) => o.status === status).length;
    setSummary({
      totalSales,
      totalOrders: data?.length || 0,
      pending: count("pending"),
      shipped: count("shipped"),
      delivered: count("delivered"),
      received: count("received"),
    });
  };

  const fetchTopProducts = async () => {
    const { data } = await supabase.from("order_items").select("product_id, quantity, products(*)");
    const map = {};
    (data || []).forEach((item) => {
      const id = item.product_id;
      if (!map[id]) {
        map[id] = { name: item.products?.name, image: item.products?.image, sold: 0 };
      }
      map[id].sold += item.quantity;
    });
    setTopProducts(Object.values(map));
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return console.log("UPDATE ERROR:", error);
    fetchAll();
  };

  const Box = ({ title, value }) => (
    <div className="border border-gray-300 p-4 rounded-lg bg-white shadow-sm">
      <h4 className="font-semibold text-gray-600">{title}</h4>
      <h2 className="text-2xl font-bold text-red-700">{value || 0}</h2>
    </div>
  );

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <button
        onClick={() => (window.location.href = "/sales-summary")}
        className="mb-6 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
      >
        📊 View Sales Summary
      </button>
      <div className="flex flex-wrap gap-4 mb-8">
        <Box title="Total Sales" value={`₱${summary.totalSales}`} />
        <Box title="Orders" value={summary.totalOrders} />
        <Box title="Pending" value={summary.pending} />
        <Box title="Shipped" value={summary.shipped} />
        <Box title="Delivered" value={summary.delivered} />
        <Box title="Received" value={summary.received} />
      </div>
      <h2 className="text-2xl font-bold mt-8 mb-4">🔥 Top Products</h2>
      <div className="flex flex-wrap gap-4 mb-8">
        {topProducts.map((p, i) => (
          <div key={i} className="border border-gray-200 p-3 rounded-lg w-40 bg-white">
            <img src={p.image} alt={p.name} className="w-full h-24 object-contain mb-2" />
            <p className="font-medium text-sm">{p.name}</p>
            <b className="text-red-600">Sold: {p.sold}</b>
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-bold mt-6 mb-4">Orders</h2>
      {orders.map((order) => (
        <div key={order.id} className="border border-gray-300 p-5 rounded-lg mb-6 bg-white shadow-sm">
          <h3 className="text-xl font-semibold">Order #{order.id}</h3>
          <p>Total: ₱{order.total_price}</p>
          <p>Status: <b className="capitalize">{order.status}</b></p>
          <p>Address: {order.address}</p>
          <div className="mt-3 space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                <img src={item.products.image} className="w-10 h-10 object-cover rounded" />
                <span>{item.products.name} (x{item.quantity})</span>
              </div>
            ))}
          </div>
          {order.status !== "received" && (
            <div className="flex gap-2 mt-4">
              <button onClick={() => updateStatus(order.id, "pending")} className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700">Pending</button>
              <button onClick={() => updateStatus(order.id, "shipped")} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Shipped</button>
              <button onClick={() => updateStatus(order.id, "delivered")} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Delivered</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Admin;