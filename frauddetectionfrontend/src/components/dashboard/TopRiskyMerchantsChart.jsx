/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import { getTopRiskyMerchants } from "../../services/merchantService";

/* Tooltip */
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 shadow-lg rounded-lg px-3 py-2 text-sm">
        <p className="text-gray-400">{label}</p>
        <p className="text-gray-900 font-semibold">
          {payload[0].value} frauds
        </p>
      </div>
    );
  }
  return null;
}

function TopRiskyMerchantsChart() {

  const [data, setData] = useState([]);
  const [seconds, setSeconds] = useState(15);
  const [animateKey, setAnimateKey] = useState(0); // 🔥 animation trigger

  const fetchMerchants = async () => {
    try {
      const result = await getTopRiskyMerchants();

      setData(result);
      setSeconds(15);

      // 🔥 trigger animation
      setAnimateKey(prev => prev + 1);

    } catch (error) {
      console.error("Merchant fetch error:", error);
    }
  };

  useEffect(() => {
    fetchMerchants();
    const interval = setInterval(fetchMerchants, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => (prev === 0 ? 15 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mt-6 transition-all duration-300">

      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">
          Top Risky Merchants
        </h2>

        <span className="text-xs text-gray-400">
          {seconds}s refresh
        </span>
      </div>

      {/* Chart */}
      <div className="p-5">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart key={animateKey} data={data} barCategoryGap="20%">

            {/* Grid */}
            <CartesianGrid stroke="#f1f5f9" vertical={false} />

            {/* X Axis */}
            <XAxis
              dataKey="merchantId"
              angle={-25}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 12, fill: "#475569", fontWeight: 500 }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />

            {/* Y Axis */}
            <YAxis
              tick={{ fontSize: 12, fill: "#475569", fontWeight: 500 }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
              label={{
                value: "Fraud Count",
                angle: -90,
                position: "insideLeft",
                fill: "#64748b",
                fontSize: 12
              }}
            />

            {/* Tooltip */}
            <Tooltip content={<CustomTooltip />} />

            {/* Bars */}
            <Bar
              dataKey="fraudCount"
              radius={[8, 8, 0, 0]}
              barSize={35}
              fill="#4f46e5"
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            />

          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default TopRiskyMerchantsChart;