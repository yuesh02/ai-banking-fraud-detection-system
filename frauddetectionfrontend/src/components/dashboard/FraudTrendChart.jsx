import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-3 border text-sm">
        <p className="text-gray-500">{label}</p>
        <p className="text-red-500 font-semibold">
          Frauds: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
}

function FraudTrendChart({ data }) {
  return (
    <div className="bg-linear-to-br from-white to-gray-50 p-5 rounded-2xl shadow-sm border border-gray-100">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Fraud Trend
        </h2>

        <span className="text-xs text-gray-400">
          Last 7 days
        </span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>

          {/* Grid */}
          <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />

          {/* X Axis */}
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />

          {/* Y Axis */}
          <YAxis
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />

          {/* Tooltip */}
          <Tooltip content={<CustomTooltip />} />

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="fraudGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          {/* Line */}
          <Line
            type="monotone"
            dataKey="fraudCount"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ r: 4, fill: "#ef4444" }}
            activeDot={{ r: 6 }}
            fill="url(#fraudGradient)"
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}

export default FraudTrendChart;