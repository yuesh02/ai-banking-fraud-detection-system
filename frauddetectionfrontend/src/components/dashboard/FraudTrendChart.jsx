import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 border border-white/10 text-sm shadow-2xl">
        <p className="text-gray-400 mb-1">{label}</p>
        <p className="text-brand-accent font-bold">
          Frauds: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
}

function FraudTrendChart({ data }) {
  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-white font-['Outfit']">Fraud Trend</h2>
        <div className="px-3 py-1 rounded-full bg-brand-accent/20 text-brand-accent text-xs font-medium border border-brand-accent/20">
          Last 7 Days
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fraudGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} dy={10} />
            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} dx={-10} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Area type="monotone" dataKey="fraudCount" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#fraudGradient)" activeDot={{ r: 6, fill: "#f43f5e", stroke: "#0b0f19", strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default FraudTrendChart;