import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import React from "react";
export default function PieChartCard({ fraud, normal }) {
  const data = [
    { name: "Fraud", value: fraud || 0 },
    { name: "Normal", value: normal || 0 }
  ];

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
      <h2 className="mb-4 font-semibold">Fraud Distribution</h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={100}>
            <Cell fill="#ef4444" />
            <Cell fill="#22c55e" />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}