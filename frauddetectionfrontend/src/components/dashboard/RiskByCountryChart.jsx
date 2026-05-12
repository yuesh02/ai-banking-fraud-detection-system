/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getRiskByCountry } from "../../services/countryService";

/* Tooltip */
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f172a] border border-white/10 shadow-lg rounded-lg px-3 py-2 text-sm backdrop-blur-md">
        <p className="text-gray-400">{label}</p>
        <p className="text-white font-semibold">{payload[0].value} frauds</p>
      </div>
    );
  }
  return null;
}

function RiskByCountryChart() {
  const [data, setData] = useState([]);
  const [seconds, setSeconds] = useState(15);
  const [animateKey, setAnimateKey] = useState(0);

  const fetchCountries = async () => {
    try {
      const result = await getRiskByCountry();
      setData(result);
      setSeconds(15);
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

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => (prev === 0 ? 15 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-card rounded-2xl border border-white/5 shadow-sm mt-6 transition-all duration-300">
      <div className="flex justify-between items-center px-5 py-4 border-b border-white/5">
        <h2 className="text-base font-semibold text-white">Risk by Country</h2>
        <span className="text-xs text-gray-500">{seconds}s refresh</span>
      </div>

      <div className="p-5">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart key={animateKey} data={data}>
            <CartesianGrid stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="country"
              tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 500 }}
              axisLine={{ stroke: "#334155" }}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 500 }}
              axisLine={{ stroke: "#334155" }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{fill: '#1e293b', opacity: 0.4}} />
            <Bar
              dataKey="fraudCount"
              radius={[8, 8, 0, 0]}
              barSize={40}
              fill="url(#colorCountryBar)"
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            />
            <defs>
              <linearGradient id="colorCountryBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={1} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.2} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RiskByCountryChart;