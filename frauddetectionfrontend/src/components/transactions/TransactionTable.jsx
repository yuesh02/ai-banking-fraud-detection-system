import { useState } from "react";
import { AlertTriangle, Eye, ShieldBan, CheckCircle, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

import Modal from "../common/Modal";
import RiskBadge from "../common/RiskBadge";


import { getTransactionDetails, updateTransactionAction } from "../../services/transactionService";

function TransactionTable({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [processingAction, setProcessingAction] = useState(null);

  const handleView = async (transactionId) => {
    try {
      const details = await getTransactionDetails(transactionId);
      setSelectedTxn(details);
      setIsOpen(true);
    } catch (error) {
      console.error("Failed to fetch details:", error);
    }
  };

  const handleAction = async (actionType) => {
    if (!selectedTxn) return;
    if (!window.confirm(`Are you sure you want to change this transaction's status to ${actionType}?`)) return;
    
    try {
      setProcessingAction(actionType);
      await updateTransactionAction(selectedTxn.transactionId, actionType);
      
      // Compute new fields based on action for optimistic UI update
      let newFraud = selectedTxn.fraud;
      let newRiskLevel = selectedTxn.riskLevel;
      
      if (actionType === "ALLOW") {
        newFraud = false;
        newRiskLevel = "LOW";
      } else if (actionType === "REVIEW") {
        newFraud = false;
        newRiskLevel = "MEDIUM";
      } else if (actionType === "BLOCK") {
        newFraud = true;
        newRiskLevel = "HIGH";
      }

      setSelectedTxn(prev => ({
        ...prev,
        action: actionType,
        fraud: newFraud,
        riskLevel: newRiskLevel,
        reason: `Manually overridden to ${actionType} by admin`
      }));
      
    } catch (error) {
      console.error("Failed to update transaction:", error);
      alert("Failed to update transaction. See console for details.");
    } finally {
      setProcessingAction(null);
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#1e293b]/30">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#0b0f19]/50 text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-5 py-4 font-medium">UUID</th>
              <th className="px-5 py-4 font-medium">Customer</th>
              <th className="px-5 py-4 font-medium">Risk</th>
              <th className="px-5 py-4 font-medium">Score</th>
              <th className="px-5 py-4 font-medium">Action</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Time</th>
              <th className="px-5 py-4 font-medium text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((txn, index) => (
              <motion.tr 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={txn.transactionId} 
                className="hover:bg-white/5 transition-colors group"
              >
                <td className="px-5 py-4 font-medium text-gray-200">
                  {txn.transactionId}
                </td>
                <td className="px-5 py-4 text-gray-400">
                  {txn.customerId}
                </td>
                <td className="px-5 py-4">
                  <RiskBadge level={txn.riskLevel} />
                </td>
                <td className="px-5 py-4 text-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${txn.riskScore > 75 ? 'bg-brand-accent' : txn.riskScore > 40 ? 'bg-yellow-400' : 'bg-green-400'}`}
                        style={{ width: `${Math.min(100, Math.max(0, txn.riskScore))}%` }}
                      />
                    </div>
                    <span className="text-xs">{txn.riskScore}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-400">
                  {txn.action}
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${
                    txn.fraud 
                      ? "bg-brand-accent/10 text-brand-accent border-brand-accent/20" 
                      : "bg-green-500/10 text-green-400 border-green-500/20"
                  }`}>
                    {txn.fraud ? "Fraud" : "Safe"}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-500 text-xs">
                  {new Date(txn.timestamp).toLocaleString()}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => handleView(txn.transactionId)}
                    className="p-2 text-gray-400 hover:text-brand-primary bg-white/5 hover:bg-brand-primary/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </motion.tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan="8" className="px-5 py-8 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {selectedTxn && (
          <div className="space-y-6 text-gray-200">
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white font-['Outfit']">
                  Transaction #{selectedTxn.transactionId}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(selectedTxn.timestamp).toLocaleString()}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${
                selectedTxn.fraud
                  ? "bg-brand-accent/10 text-brand-accent border-brand-accent/20"
                  : "bg-green-500/10 text-green-400 border-green-500/20"
              }`}>
                {selectedTxn.fraud ? <><ShieldAlert size={14}/> Fraud Detected</> : <><CheckCircle size={14}/> Safe Activity</>}
              </div>
            </div>

            {/* Admin Actions Panel added to Modal */}
            <div className="flex gap-2 justify-center py-2">
              {selectedTxn.action !== "ALLOW" && (
                <button
                  onClick={() => handleAction("ALLOW")}
                  disabled={processingAction !== null}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/30 rounded-lg text-sm font-bold hover:bg-green-500/20 transition-all disabled:opacity-50"
                >
                  <CheckCircle size={16} />
                  {processingAction === "ALLOW" ? "Processing..." : "Approve"}
                </button>
              )}

              {selectedTxn.action !== "REVIEW" && (
                <button
                  onClick={() => handleAction("REVIEW")}
                  disabled={processingAction !== null}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg text-sm font-bold hover:bg-amber-500/20 transition-all disabled:opacity-50"
                >
                  <Eye size={16} />
                  {processingAction === "REVIEW" ? "Processing..." : "Flag Review"}
                </button>
              )}

              {selectedTxn.action !== "BLOCK" && (
                <button
                  onClick={() => handleAction("BLOCK")}
                  disabled={processingAction !== null}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-accent/10 text-brand-accent border border-brand-accent/30 rounded-lg text-sm font-bold hover:bg-brand-accent/20 transition-all disabled:opacity-50"
                >
                  <ShieldBan size={16} />
                  {processingAction === "BLOCK" ? "Processing..." : "Block Fraud"}
                </button>
              )}
            </div>

            <div className="bg-[#0f172a] border border-brand-primary/20 rounded-xl p-6 text-center shadow-[0_0_15px_rgba(139,92,246,0.1)]">
              <p className="text-xs text-brand-primary uppercase tracking-wider font-semibold">Amount</p>
              <p className="text-4xl font-bold text-white mt-2">
                $ {selectedTxn.amount?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoCard label="Customer ID" value={selectedTxn.customerId} mono />
              <InfoCard label="Account ID" value={selectedTxn.accountId} mono />
              <InfoCard label="Merchant ID" value={selectedTxn.merchantId} mono />
              <InfoCard label="Merchant Category" value={selectedTxn.merchantCategory} />
              <InfoCard label="Merchant Country" value={selectedTxn.merchantCountry} />
              <InfoCard label="Customer Country" value={selectedTxn.customerCountry} />
              <InfoCard label="Device ID" value={selectedTxn.deviceId} mono />
              <InfoCard label="IP Address" value={selectedTxn.ipAddress} mono />
              <InfoCard label="Channel" value={selectedTxn.channel} />
              <InfoCard label="Transaction Type" value={selectedTxn.transactionType} />
              <InfoCard label="Risk Score" value={selectedTxn.riskScore} highlight />
              <InfoCard label="System Action" value={selectedTxn.action} />
            </div>

            {selectedTxn.reason && (
              <div className={`relative overflow-hidden flex gap-4 items-start rounded-xl p-5 border ${
                selectedTxn.riskLevel?.toLowerCase() === 'low' 
                  ? "bg-green-500/10 border-green-500/20" 
                  : selectedTxn.riskLevel?.toLowerCase() === 'medium'
                  ? "bg-amber-500/10 border-amber-500/20"
                  : "bg-brand-accent/10 border-brand-accent/20"
              }`}>
                <div className={`p-2 rounded-lg ${
                  selectedTxn.riskLevel?.toLowerCase() === 'low' 
                    ? "bg-green-500/20 text-green-400" 
                    : selectedTxn.riskLevel?.toLowerCase() === 'medium'
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-brand-accent/20 text-brand-accent"
                }`}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${
                    selectedTxn.riskLevel?.toLowerCase() === 'low' 
                      ? "text-green-400" 
                      : selectedTxn.riskLevel?.toLowerCase() === 'medium'
                      ? "text-amber-400"
                      : "text-brand-accent"
                  }`}>
                    {selectedTxn.riskLevel?.toLowerCase() === "low" ? "Low Risk Activity" 
                     : selectedTxn.riskLevel?.toLowerCase() === "medium" ? "Suspicious Activity"
                     : "Fraud Detected"}
                  </h4>
                  <p className="text-sm text-gray-300 mt-1">
                    {selectedTxn.reason}
                  </p>
                </div>
              </div>
            )}


          </div>
        )}
      </Modal>
    </div>
  );
}

function InfoCard({ label, value, highlight, mono }) {
  return (
    <div className={`rounded-xl border p-3 ${
      highlight
        ? "bg-brand-primary/10 border-brand-primary/20"
        : "bg-white/5 border-white/5"
    }`}>
      <p className="text-[11px] text-gray-500 uppercase tracking-wider">
        {label}
      </p>
      <p className={`text-sm font-semibold mt-1 break-all ${
        highlight ? "text-brand-primary" : "text-gray-200"
      } ${mono ? "font-mono text-xs" : ""}`}>
        {value ?? <span className="text-gray-600 italic">—</span>}
      </p>
    </div>
  );
}

export default TransactionTable;