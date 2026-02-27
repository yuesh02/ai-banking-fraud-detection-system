import React from "react";
export default function StatCard({ title, value, danger }) {
  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-md border border-slate-700">
      <p className="text-sm text-slate-400">{title}</p>
      <p className={`text-2xl font-bold mt-2 ${danger ? "text-red-500" : ""}`}>
        {value}
      </p>
    </div>
  );
}