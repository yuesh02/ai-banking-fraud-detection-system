import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Zap, ShieldAlert, ShieldCheck } from "lucide-react";
import { getLiveTransactions } from "../../services/liveService";

function DashboardLiveFeed() {
  const [feed, setFeed] = useState([]);

  const fetchFeed = async () => {
    try {
      const data = await getLiveTransactions();
      // Keep only last 6 for the compact view
      setFeed(data.slice(0, 6));
    } catch (error) {
      console.error("Feed error:", error);
    }
  };

  useEffect(() => {
    fetchFeed();
    const interval = setInterval(fetchFeed, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#111827]/40 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-md h-full flex flex-col">
      <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <h2 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
          <Activity size={14} className="text-brand-primary animate-pulse" /> Live System Heartbeat
        </h2>
        <div className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[9px] font-bold text-green-400">
          STREAMING
        </div>
      </div>

      <div className="flex-1 p-4 space-y-3 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {feed.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-600 text-[10px] uppercase font-bold italic">
              Waiting for ingress...
            </div>
          ) : (
            feed.map((item, idx) => (
              <motion.div
                key={item.transactionId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  item.riskLevel === 'HIGH' 
                    ? 'bg-brand-accent/5 border-brand-accent/20' 
                    : 'bg-[#0b0f19]/50 border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    item.riskLevel === 'HIGH' ? 'bg-brand-accent/20 text-brand-accent' : 'bg-green-500/10 text-green-400'
                  }`}>
                    {item.riskLevel === 'HIGH' ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-white uppercase tracking-tighter">
                      {item.customerId.substring(0, 15)}...
                    </p>
                    <p className="text-[9px] text-gray-500 font-mono">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-xs font-black ${
                    item.riskLevel === 'HIGH' ? 'text-brand-accent' : 'text-white'
                  }`}>
                    ${item.amount.toLocaleString()}
                  </p>
                  <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">
                    {item.riskLevel}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="px-6 py-3 bg-[#0b0f19]/40 border-t border-white/5 flex justify-center">
         <div className="flex items-center gap-2 text-[9px] text-gray-600 font-bold uppercase tracking-widest">
            <Zap size={10} className="text-brand-primary" /> End-to-End Latency: 14ms
         </div>
      </div>
    </div>
  );
}

export default DashboardLiveFeed;
