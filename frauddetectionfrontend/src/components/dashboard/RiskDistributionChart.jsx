import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const COLORS = [
  "#22c55e", // LOW - Green
  "#eab308", // MEDIUM - Yellow
  "#f43f5e"  // HIGH - Rose/Brand Accent
];

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 border border-white/10 text-sm shadow-2xl">
        <p className="text-gray-300 mb-1">{payload[0].name}</p>
        <p className="font-bold" style={{ color: payload[0].payload.fill }}>
          Count: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
}

function RiskDistributionChart({ data }) {
  return (
    <div className="glass-card p-6 h-full flex flex-col">

      <h2 className="text-lg font-semibold text-white font-['Outfit'] mb-4">
        Risk Distribution
      </h2>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="level"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RiskDistributionChart;