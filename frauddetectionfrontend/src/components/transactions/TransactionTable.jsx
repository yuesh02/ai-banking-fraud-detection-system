import { useState } from "react";
import { AlertTriangle } from "lucide-react";

import Modal from "../common/Modal";
import RiskBadge from "../common/RiskBadge";
import TransactionHistoryTimeline from "./TransactionHistoryTimeline";

import {
  getTransactionDetails
} from "../../services/transactionService";

/* =========================
   MAIN TABLE
========================= */

function TransactionTable({ data }) {

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);

  const handleView = async (transactionId) => {
    try {
      const details = await getTransactionDetails(transactionId);
      setSelectedTxn(details);
      setIsOpen(true);
    } catch (error) {
      console.error("Failed to fetch details:", error);
    }
  };

  const handleViewHistoryTxn = async (transactionId) => {
    try {
      const details = await getTransactionDetails(transactionId);
      setSelectedTxn(details);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">

      <h2 className="text-base font-semibold text-gray-800 mb-4">
        Transactions
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Transaction</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Risk</th>
              <th className="px-4 py-3 text-left">Score</th>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left">Fraud</th>
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>

          <tbody className="divide-y">

            {data.map((txn) => (

              <tr key={txn.transactionId} className="hover:bg-gray-50 transition">

                <td className="px-4 py-3 font-medium text-gray-800">
                  {txn.transactionId}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {txn.customerId}
                </td>

                <td className="px-4 py-3">
                  <RiskBadge level={txn.riskLevel} />
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {txn.riskScore}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {txn.action}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`
                      px-2 py-1 text-xs rounded-full font-medium
                      ${txn.fraud
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"}
                    `}
                  >
                    {txn.fraud ? "Fraud" : "Safe"}
                  </span>
                </td>

                <td className="px-4 py-3 text-gray-500 text-xs">
                  {new Date(txn.timestamp).toLocaleString()}
                </td>

                <td className="px-4 py-3 text-right">

                  <button
                    onClick={() => handleView(txn.transactionId)}
                    className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    View
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* =========================
          MODAL
      ========================= */}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>

        {selectedTxn && (

          <div className="space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Transaction #{selectedTxn.transactionId}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(selectedTxn.timestamp).toLocaleString()}
                </p>
              </div>

              <div className={`px-3 py-1 rounded-full text-xs font-semibold
                ${selectedTxn.fraud
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
                }`}>
                {selectedTxn.fraud ? "Fraud ⚠️" : "Safe ✔️"}
              </div>

            </div>

            {/* Amount */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 text-center">
              <p className="text-xs text-gray-500">Amount</p>
              <p className="text-3xl font-bold text-indigo-600 mt-1">
                ₹ {selectedTxn.amount?.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <InfoCard label="Customer ID" value={selectedTxn.customerId} />
              <InfoCard label="Merchant ID" value={selectedTxn.merchantId} />
              <InfoCard label="Country" value={selectedTxn.merchantCountry} />
              <InfoCard label="Device ID" value={selectedTxn.deviceId} />
              <InfoCard label="Risk Score" value={selectedTxn.riskScore} />

              <InfoCard
                label="Risk Level"
                value={selectedTxn.riskLevel}
                highlight
              />

              <InfoCard label="Action" value={selectedTxn.action} />

            </div>

            {/* 🔥 DYNAMIC FRAUD ALERT */}
            {selectedTxn.reason && (() => {

              const level = selectedTxn.riskLevel?.toLowerCase();

              const styles = {
                high: {
                  container: "border-red-200 bg-gradient-to-br from-red-50 via-white to-red-100",
                  accent: "bg-red-500",
                  iconBg: "bg-red-100 text-red-600",
                  title: "text-red-700",
                  badge: "bg-red-200 text-red-700"
                },
                medium: {
                  container: "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-amber-100",
                  accent: "bg-amber-500",
                  iconBg: "bg-amber-100 text-amber-600",
                  title: "text-amber-700",
                  badge: "bg-amber-200 text-amber-700"
                },
                low: {
                  container: "border-green-200 bg-gradient-to-br from-green-50 via-white to-green-100",
                  accent: "bg-green-500",
                  iconBg: "bg-green-100 text-green-600",
                  title: "text-green-700",
                  badge: "bg-green-200 text-green-700"
                }
              };

              const style = styles[level] || styles.high;

              return (
                <div
                  className={`
                    relative overflow-hidden
                    flex gap-4 items-start
                    rounded-2xl p-5
                    border
                    shadow-sm
                    transition hover:shadow-md
                    ${style.container}
                  `}
                >

                  <div className={`absolute left-0 top-0 h-full w-1.5 ${style.accent} rounded-l-2xl`} />

                  <div className={`mt-1 p-3 rounded-xl flex items-center justify-center ${style.iconBg}`}>
                    <AlertTriangle size={18} />
                  </div>

                  <div className="flex-1">

                    <div className="flex items-center gap-2">

                      <p className={`text-sm font-semibold ${style.title}`}>
                        {level === "low" ? "Low Risk Activity" : "Fraud Detected"}
                      </p>

                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${style.badge}`}>
                        {selectedTxn.riskLevel.toUpperCase()}
                      </span>

                    </div>

                    <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                      {selectedTxn.reason}
                    </p>

                  </div>

                </div>
              );

            })()}

            {/* Timeline */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Transaction History
              </h3>

              <div className="border rounded-xl p-4 bg-gray-50">
                <TransactionHistoryTimeline
                  history={selectedTxn.history}
                  onViewHistoryTxn={handleViewHistoryTxn}
                />
              </div>
            </div>

          </div>

        )}

      </Modal>

    </div>
  );
}

/* =========================
   INFO CARD
========================= */

function InfoCard({ label, value, highlight }) {
  return (
    <div className={`rounded-xl border p-4
      ${highlight
        ? "bg-indigo-50 border-indigo-100"
        : "bg-gray-50 border-gray-100"
      }`}>

      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="text-sm font-semibold text-gray-800 mt-1">
        {value}
      </p>

    </div>
  );
}

export default TransactionTable;