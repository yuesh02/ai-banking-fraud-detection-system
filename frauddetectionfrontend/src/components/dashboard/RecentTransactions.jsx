/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { getRecentTransactions } from "../../services/recentService";
import RiskBadge from "../common/RiskBadge";
import { motion, AnimatePresence } from "framer-motion";

function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [seconds, setSeconds] = useState(10);

  const fetchRecent = async () => {
    try {
      const data = await getRecentTransactions();
      setTransactions(data.filter(txn => txn != null));
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

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => (prev === 0 ? 10 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-card shadow-sm rounded-2xl p-5 border border-white/5">
      <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
        <h2 className="text-base font-semibold text-white">Recent Transactions</h2>
        <div className="text-xs text-gray-500 font-medium bg-[#1e293b]/50 px-3 py-1.5 rounded-lg border border-white/5">
          Refreshing in <span className="font-bold ml-1 text-brand-secondary">{seconds}s</span>
        </div>
      </div>

      <div className="max-h-[450px] overflow-y-auto pr-2 space-y-3 scrollbar-hide">
        <AnimatePresence>
          {transactions.map((txn, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={txn.transactionId}
              className={`rounded-xl p-4 border flex flex-col md:flex-row md:items-center md:justify-between gap-3 transition-all hover:shadow-lg ${
                txn.fraud ? "bg-brand-accent/5 border-brand-accent/20" : "bg-[#1e293b]/30 border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex-1">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">UUID</p>
                <p className="font-mono text-sm text-gray-200 mt-0.5">{txn.transactionId}</p>
                <p className="text-xs text-gray-400 mt-2">Customer: <span className="text-gray-300">{txn.customerId}</span></p>
              </div>

              <div className="text-left md:text-center w-24">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Amount</p>
                <p className="font-bold text-white text-sm">
                  $ {Number(txn.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="text-left md:text-center w-24">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Risk</p>
                <RiskBadge level={txn.riskLevel} />
              </div>

              <div className="text-left md:text-center w-24">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Status</p>
                <span className={`px-2 py-1 text-[10px] font-bold rounded-md border ${
                  txn.fraud ? "bg-brand-accent/10 text-brand-accent border-brand-accent/20" 
                  : txn.action === "CHALLENGE_MFA" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                  : txn.action === "REVIEW" ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-green-500/10 text-green-400 border-green-500/20"
                }`}>
                  {txn.fraud ? "FRAUD" : txn.action}
                </span>
              </div>

              <div className="text-left md:text-right flex-1">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Time</p>
                <p className="text-gray-400 text-xs">{new Date(txn.timestamp).toLocaleString()}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default RecentTransactions;