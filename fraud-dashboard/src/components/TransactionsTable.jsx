import React from "react";
export default function TransactionsTable({ transactions }) {
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mt-8">
      <h2 className="mb-4 font-semibold">Recent Transactions</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-slate-400 border-b border-slate-700">
            <th className="text-left pb-3">Customer</th>
            <th>Amount</th>
            <th>Risk</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map(tx => (
            <tr key={tx.transactionId} className="border-b border-slate-800">
              <td className="py-3">{tx.customerId}</td>
              <td>₹{tx.amount}</td>
              <td>{tx.riskScore}</td>
              <td>
                <span className={`px-3 py-1 rounded-full text-xs
                  ${tx.fraud
                    ? "bg-red-500/20 text-red-400"
                    : "bg-green-500/20 text-green-400"}`}>
                  {tx.fraud ? "Fraud" : "Safe"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}