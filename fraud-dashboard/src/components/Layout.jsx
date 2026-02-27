import React from "react";
export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-red-500">
        Fraud Analytics Dashboard
      </h1>
      {children}
    </div>
  );
}