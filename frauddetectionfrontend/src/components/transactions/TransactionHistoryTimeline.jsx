import { ArrowUpRight, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

function TransactionHistoryTimeline({ history, onViewHistoryTxn }) {
  if (!history || history.length === 0) {
    return <p className="text-gray-500 mt-4 text-sm italic">No history available for this customer.</p>;
  }

  return (
    <div className="mt-2">
      <div className="relative border-l border-brand-primary/30 ml-4">
        {history.map((item, index) => {
          const isFraud = item.fraud;
          const isLatest = index === 0;

          return (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              key={index}
              className="ml-6 mb-6 relative group"
            >
              <div
                className={`absolute -left-[29px] top-2 w-3 h-3 rounded-full border-2 border-[#0b0f19] ${
                  isFraud ? "bg-brand-accent" : "bg-brand-primary"
                }`}
              />

              <div className={`rounded-xl p-4 border transition-colors ${
                isLatest
                  ? "bg-brand-primary/10 border-brand-primary/30"
                  : "bg-[#1e293b]/50 border-white/5 hover:border-white/20"
              }`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isFraud ? "bg-brand-accent/20 text-brand-accent" : "bg-brand-primary/20 text-brand-primary"
                    }`}>
                      {isFraud ? <AlertTriangle size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <p className="font-bold text-white">
                      $ {item.amount?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>

                  <span className={`text-[10px] px-2 py-1 rounded-md font-bold border ${
                    isFraud ? "bg-brand-accent/10 text-brand-accent border-brand-accent/20" : "bg-green-500/10 text-green-400 border-green-500/20"
                  }`}>
                    {isFraud ? "FRAUD" : "SAFE"}
                  </span>
                </div>

                <div className="mt-3 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Merchant</p>
                    <p className="text-sm text-gray-200 mt-0.5">{item.merchantId}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                  </div>
                  
                  <button
                    onClick={() => onViewHistoryTxn(item.transactionId)}
                    className="text-xs px-3 py-1.5 bg-white/5 hover:bg-brand-primary/20 text-gray-300 hover:text-white rounded-lg transition-colors border border-white/5 hover:border-brand-primary/30"
                  >
                    View
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default TransactionHistoryTimeline;