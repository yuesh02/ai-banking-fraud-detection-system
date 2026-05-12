import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList, CheckCircle, ShieldBan, Clock,
  RefreshCw, Inbox, AlertTriangle, Filter, Eye
} from "lucide-react";
import { getReviewQueue, updateTransactionAction } from "../services/transactionService";
import RiskBadge from "../components/common/RiskBadge";

function CaseQueue() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [filter, setFilter] = useState("ALL"); // ALL | HIGH | MEDIUM
  const [resolvedCount, setResolvedCount] = useState(0);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const loadCases = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getReviewQueue();
      setCases(data);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Failed to fetch review queue:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCases();
    const interval = setInterval(loadCases, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, [loadCases]);

  const handleDecision = async (transactionId, action) => {
    const label = action === "ALLOW" ? "approve" : "block";
    if (!window.confirm(`Are you sure you want to ${label} transaction ${transactionId}?`)) return;

    try {
      setProcessingId(transactionId);
      await updateTransactionAction(transactionId, action);
      // Optimistically remove from queue
      setCases(prev => prev.filter(c => c.transactionId !== transactionId));
      setResolvedCount(prev => prev + 1);
    } catch (err) {
      console.error("Failed to process decision:", err);
      alert("Failed to submit decision. See console for details.");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredCases = cases.filter(c => {
    if (filter === "ALL") return true;
    return c.riskLevel === filter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <ClipboardList className="text-amber-400" size={22} />
            </div>
            <h1 className="text-2xl font-bold text-white">Case Review Queue</h1>
          </div>
          <p className="text-gray-400 text-sm ml-14">
            {cases.length} pending decision{cases.length !== 1 ? "s" : ""} · {resolvedCount} resolved this session
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Risk Filter */}
          <div className="flex gap-1 bg-[#1e293b]/60 border border-white/5 rounded-xl p-1">
            {["ALL", "HIGH", "MEDIUM"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === f
                    ? f === "HIGH" ? "bg-brand-accent/20 text-brand-accent border border-brand-accent/30"
                    : f === "MEDIUM" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-white/10 text-white border border-white/10"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={loadCases}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Last refreshed */}
      <p className="text-xs text-gray-600">
        Last refreshed: {lastRefreshed.toLocaleTimeString()} · Auto-refreshes every 30s
      </p>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Awaiting Review", value: cases.length, color: "amber" },
          { label: "High Risk Cases", value: cases.filter(c => c.riskLevel === "HIGH").length, color: "red" },
          { label: "Resolved Today", value: resolvedCount, color: "green" },
        ].map(stat => (
          <div key={stat.label} className="glass-card rounded-xl border border-white/5 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${
              stat.color === "amber" ? "text-amber-400"
              : stat.color === "red" ? "text-brand-accent"
              : "text-green-400"
            }`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Case Cards */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredCases.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4"
        >
          <div className="p-5 bg-white/5 rounded-2xl">
            <Inbox size={40} className="text-gray-600" />
          </div>
          <p className="text-lg font-semibold text-gray-400">No cases pending review</p>
          <p className="text-sm text-gray-600">
            {filter !== "ALL" ? `No ${filter} risk cases — try changing the filter.` : "All transactions have been resolved. Great work!"}
          </p>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {filteredCases.map((c, idx) => (
              <motion.div
                key={c.transactionId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ delay: idx * 0.04 }}
                className={`glass-card rounded-2xl border p-6 relative overflow-hidden ${
                  c.riskLevel === "HIGH"
                    ? "border-brand-accent/20 bg-brand-accent/5"
                    : "border-amber-500/20 bg-amber-500/5"
                }`}
              >
                {/* Glow blob */}
                <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[60px] opacity-10 pointer-events-none ${
                  c.riskLevel === "HIGH" ? "bg-brand-accent" : "bg-amber-500"
                }`} />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-base font-bold text-white font-mono">{c.transactionId}</span>
                      <RiskBadge level={c.riskLevel} />
                      <span className="flex items-center gap-1 text-amber-400 text-xs font-bold px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-md">
                        <AlertTriangle size={11} /> REVIEW REQUIRED
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 text-sm">
                      <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider block">Customer</span>
                        <span className="text-gray-200 font-mono">{c.customerId}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider block">Amount</span>
                        <span className="text-white font-bold">
                          ${Number(c.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider block">Risk Score</span>
                        <span className="text-gray-200">{c.riskScore ?? "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider block">Time</span>
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          <Clock size={11} />
                          {new Date(c.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {c.reason && (
                      <div className="bg-[#0b0f19]/60 rounded-lg px-3 py-2 border border-white/5">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Detection Reason: </span>
                        <span className="text-sm text-gray-300 italic">{c.reason}</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex flex-col gap-2 min-w-[160px]">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(`/transactions/${c.transactionId}`)}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 text-gray-300 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all w-full"
                    >
                      <Eye size={16} />
                      View Details
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleDecision(c.transactionId, "ALLOW")}
                      disabled={processingId !== null}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-500/10 text-green-400 border border-green-500/30 rounded-xl font-bold hover:bg-green-500/20 transition-all disabled:opacity-50 w-full"
                    >
                      <CheckCircle size={16} />
                      {processingId === c.transactionId ? "Processing…" : "Approve"}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleDecision(c.transactionId, "BLOCK")}
                      disabled={processingId !== null}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-accent/10 text-brand-accent border border-brand-accent/30 rounded-xl font-bold hover:bg-brand-accent/20 transition-all disabled:opacity-50 w-full"
                    >
                      <ShieldBan size={16} />
                      {processingId === c.transactionId ? "Processing…" : "Block Fraud"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default CaseQueue;
