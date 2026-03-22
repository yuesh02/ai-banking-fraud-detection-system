import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const COLORS = [
  "#22c55e", // LOW
  "#eab308", // MEDIUM
  "#ef4444"  // HIGH
];

function RiskDistributionChart({ data }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">

      <h2 className="text-lg font-semibold mb-4">
        Risk Distribution
      </h2>

      <ResponsiveContainer width="100%" height={300}>

        <PieChart>

          <Pie
            data={data}
            dataKey="count"
            nameKey="level"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >

            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  COLORS[index % COLORS.length]
                }
              />
            ))}

          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}

export default RiskDistributionChart;