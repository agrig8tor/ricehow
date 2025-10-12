"use client"; // This component needs to be a client component for interactivity

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define the structure of the data coming from Supabase
type RicePriceData = {
  report_date: string;
  price_thailand: number | null;
  price_vietnam: number | null;
  price_indonesia: number | null;
  price_cambodia: number | null;
  price_india: number | null;
};

interface RicePriceChartProps {
  initialData: RicePriceData[];
}

// Define our countries, their data keys, and a color for their line
const countries = [
  { name: "Thailand", key: "price_thailand", color: "#166534" }, // dark-green-800
  { name: "Vietnam", key: "price_vietnam", color: "#22c55e" },   // green-500
  { name: "Indonesia", key: "price_indonesia", color: "#f97316" }, // orange-500
  { name: "Cambodia", key: "price_cambodia", color: "#3b82f6" },  // blue-500
  { name: "India", key: "price_india", color: "#8b5cf6" },      // violet-500
];

const tabs = ["All", ...countries.map(c => c.name)];

export default function RicePriceChart({ initialData }: RicePriceChartProps) {
  const [activeTab, setActiveTab] = useState("All");

  // useMemo will re-calculate the chart data only when the initialData prop changes.
  // This is more efficient than re-calculating on every render.
  const chartData = useMemo(() => {
    return initialData.map((item) => ({
      // Format the date to be more readable on the x-axis (e.g., "Oct 2025")
      name: new Date(item.report_date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      ...item, // Spread the rest of the country prices
    }));
  }, [initialData]);

  return (
    <section className="w-full p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Rice Prices
        </h2>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                activeTab === tab
                  ? "bg-green-100 text-green-800 font-semibold"
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          {/* Very light grey grid lines */}
          <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937", // bg-gray-800
              borderColor: "#374151",     // border-gray-700
              borderRadius: "0.5rem",
            }}
          />
          <Legend />

          {/* Conditionally render lines based on the active tab */}
          {countries
            .filter(
              (country) => activeTab === "All" || activeTab === country.name
            )
            .map((country) => (
              <Line
                key={country.key}
                type="monotone"
                dataKey={country.key}
                name={country.name}
                stroke={country.color}
                strokeWidth={2} // "light line"
                dot={{ r: 3, strokeWidth: 1, fill: country.color }} // "small bullet points"
                activeDot={{ r: 6 }}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}