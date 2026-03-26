/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { getRecentTransactions } from "../../services/recentService";
import RiskBadge from "../common/RiskBadge";

function RecentTransactions() {

  const [transactions, setTransactions] = useState([]);
  const [seconds, setSeconds] = useState(10);

  /* Fetch transactions */
  const fetchRecent = async () => {
    try {
      const data = await getRecentTransactions();

      setTransactions(
        data.filter(txn => txn != null)
      );

      setSeconds(10);

    } catch (error) {
      console.error("Recent fetch error:", error);
    }
  };

  useEffect(() => {
    fetchRecent();

    const interval = setInterval(fetchRecent, 10000);
    return () => clearInterval(interval);
  }, []);

  /* Countdown */
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => (prev === 0 ? 10 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
  <div className="bg-white shadow-sm rounded-2xl p-5 mt-6 border border-gray-100">

    {/* Header */}
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800">
        Recent Transactions
      </h2>

      <div className="text-sm text-gray-500">
        Refreshing in
        <span className="font-bold ml-1 text-blue-600">
          {seconds}s
        </span>
      </div>
    </div>

    {/*  Scrollable Container */}
    <div className="max-h-100 overflow-y-auto pr-2 space-y-3 scroll-smooth">

      {transactions.map((txn) => (

        <div
          key={txn.transactionId}
          className={`
            rounded-xl p-4 border
            flex flex-col md:flex-row md:items-center md:justify-between
            gap-3
            transition hover:shadow-md
            ${txn.fraud ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"}
          `}
        >

          {/* Left */}
          <div>
            <p className="text-sm text-gray-500">Transaction ID</p>
            <p className="font-semibold text-gray-800">
              {txn.transactionId}
            </p>

            <p className="text-sm text-gray-500 mt-1">Customer</p>
            <p className="text-gray-700">{txn.customerId}</p>
          </div>

          {/* Amount */}
          <div className="text-left md:text-center">
            <p className="text-sm text-gray-500">Amount</p>
            <p className="font-semibold text-gray-900">
              ₹ {Number(txn.amount).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
          </div>

          {/* Risk */}
          <div className="text-left md:text-center">
            <p className="text-sm text-gray-500">Risk</p>
            <RiskBadge level={txn.riskLevel} />
          </div>

          {/* Fraud */}
          <div className="text-left md:text-center">
            <p className="text-sm text-gray-500">Fraud</p>
            <span
              className={`font-semibold ${
                txn.fraud ? "text-red-600" : "text-green-600"
              }`}
            >
              {txn.fraud ? "Fraud " : "Safe "}
            </span>
          </div>

          {/* Time */}
          <div className="text-left md:text-right">
            <p className="text-sm text-gray-500">Time</p>
            <p className="text-gray-700 text-sm">
              {new Date(txn.timestamp).toLocaleString()}
            </p>
          </div>

        </div>

      ))}

    </div>

  </div>
);
}

export default RecentTransactions;