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

import { getRiskByCountry } from "../../services/countryService";

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

function RiskByCountryChart() {

  const [data, setData] = useState([]);
  const [seconds, setSeconds] = useState(15);
  const [animateKey, setAnimateKey] = useState(0); // 🔥 for animation reset

  const fetchCountries = async () => {
    try {
      const result = await getRiskByCountry();

      setData(result);
      setSeconds(15);

      // 🔥 trigger animation on refresh
      setAnimateKey(prev => prev + 1);

    } catch (error) {
      console.error("Country fetch error:", error);
    }
  };

  useEffect(() => {
    fetchCountries();
    const interval = setInterval(fetchCountries, 15000);
    return () => clearInterval(interval);
  }, []);

  /* Countdown */
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
          Risk by Country
        </h2>

        <span className="text-xs text-gray-400">
          {seconds}s refresh
        </span>
      </div>

      {/* Chart */}
      <div className="p-5">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart key={animateKey} data={data}>

            {/* Grid */}
            <CartesianGrid stroke="#f1f5f9" vertical={false} />

            {/* X Axis */}
            <XAxis
              dataKey="country"
              tick={{ fontSize: 12, fill: "#475569", fontWeight: 500 }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
              interval={0}
            />

            {/* Y Axis */}
            <YAxis
              tick={{ fontSize: 12, fill: "#475569", fontWeight: 500 }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />

            {/* Tooltip */}
            <Tooltip content={<CustomTooltip />} />

            {/* Bars */}
            <Bar
              dataKey="fraudCount"
              radius={[8, 8, 0, 0]}
              barSize={40}
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

export default RiskByCountryChart;