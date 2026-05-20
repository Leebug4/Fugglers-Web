import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function SaleSummary() {
  const [rawData, setRawData] = useState([]);

  const [daily, setDaily] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [yearly, setYearly] = useState([]);

  // DATE RANGE
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [rangeDaily, setRangeDaily] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    const { data, error } = await supabase
      .from("sales_summary")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.log("FETCH ERROR:", error);
      return;
    }

    const safeData = data || [];
    setRawData(safeData);
    processData(safeData);
  };

  // MAIN PROCESSING
  const processData = (data) => {
    const dailyMap = {};
    const monthlyMap = {};
    const yearlyMap = {};

    data.forEach((item) => {
      if (!item.date) return;

      const date = new Date(item.date);
      if (isNaN(date)) return;

      const sales = Number(item.total_sales || 0);

      const dayKey = date.toISOString().split("T")[0];
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const yearKey = `${date.getFullYear()}`;

      dailyMap[dayKey] = (dailyMap[dayKey] || 0) + sales;
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + sales;
      yearlyMap[yearKey] = (yearlyMap[yearKey] || 0) + sales;
    });

    setDaily(formatMap(dailyMap));
    setMonthly(formatMap(monthlyMap));
    setYearly(formatMap(yearlyMap));
  };

  const formatMap = (map) => {
    return Object.keys(map)
      .sort()
      .map((key) => ({
        label: key,
        total: map[key]
      }));
  };

  // DATE RANGE FILTER (NO TIME)
  const handleRangeFilter = () => {
    if (!fromDate || !toDate) return;

    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    const filtered = rawData.filter((item) => {
      const date = new Date(item.date);
      return date >= from && date <= to;
    });

    const dailyMap = {};

    filtered.forEach((item) => {
      const date = new Date(item.date);
      const sales = Number(item.total_sales || 0);

      const dayKey = date.toISOString().split("T")[0];
      dailyMap[dayKey] = (dailyMap[dayKey] || 0) + sales;
    });

    setRangeDaily(formatMap(dailyMap));
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>📊 Sales Summary Dashboard</h1>

      {/* BACK */}
      <button
        onClick={() => window.location.href = "/admin"}
        style={{
          marginBottom: 20,
          padding: "8px 12px",
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        ← Back to Admin
      </button>

      {/* MAIN CHARTS */}
      <h2>📅 Daily Sales</h2>
      <Chart data={daily} />

      <h2 style={{ marginTop: 30 }}>📆 Monthly Sales</h2>
      <Chart data={monthly} />

      <h2 style={{ marginTop: 30 }}>📊 Yearly Sales</h2>
      <Chart data={yearly} />

      {/* DATE RANGE */}
      <h2 style={{ marginTop: 40 }}>📊 Sales by Date Range</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          style={{ padding: 8 }}
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          style={{ padding: 8 }}
        />

        <button
          onClick={handleRangeFilter}
          style={{
            padding: "8px 12px",
            background: "green",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Generate
        </button>
      </div>

      {/* RANGE CHART */}
      <h3>📅 Range Daily Sales</h3>
      <Chart data={rangeDaily} />
    </div>
  );
}

// CHART COMPONENT
const Chart = ({ data }) => {
  return (
    <div style={{ border: "1px solid #ddd", padding: 15 }}>
      <Line
        data={{
          labels: data.map((d) => d.label),
          datasets: [
            {
              label: "Sales (₱)",
              data: data.map((d) => d.total),
              borderColor: "blue"
            }
          ]
        }}
      />
    </div>
  );
};

export default SaleSummary;