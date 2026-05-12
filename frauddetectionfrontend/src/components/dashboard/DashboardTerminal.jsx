import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Wifi } from "lucide-react";
import { getLiveTransactions } from "../../services/liveService";

function DashboardTerminal() {
  const [logs, setLogs] = useState([
    { id: 'boot', msg: "CORE_BOOT_SEQUENCE: SUCCESS", time: new Date().toLocaleTimeString(), level: 'INFO' },
    { id: 'link', msg: "ESTABLISHING_NEURAL_LINK...", time: new Date().toLocaleTimeString(), level: 'INFO' }
  ]);

  const fetchLogs = async () => {
    try {
      const data = await getLiveTransactions();
      if (data.length > 0) {
        const newLogs = data.map(t => ({
          id: t.transactionId,
          msg: `>>> INGRESS: [${t.transactionId.substring(0,8)}] $${t.amount} -> ${t.riskLevel}`,
          time: new Date().toLocaleTimeString(),
          level: t.riskLevel
        }));
        setLogs(prev => [...newLogs, ...prev].slice(0, 15));
      }
    } catch (error) {
      console.error("Terminal error:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#05070a] rounded-3xl border border-white/10 overflow-hidden font-mono h-full flex flex-col shadow-2xl relative">
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] z-20 bg-[length:100%_4px]" />
      
      <div className="px-5 py-3 border-b border-white/5 flex justify-between items-center bg-[#0b0f19]">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-brand-primary" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live_System_Audit</span>
        </div>
        <div className="flex items-center gap-1.5">
           <Wifi size={10} className="text-green-500 animate-pulse" />
           <span className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">NODE: 8082_UP</span>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-1 overflow-hidden">
        <AnimatePresence initial={false}>
          {logs.map((log, idx) => (
            <motion.div
              key={log.id + idx}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-[10px] leading-tight flex gap-3 ${
                log.level === 'HIGH' ? 'text-brand-accent font-bold' : 'text-gray-500'
              }`}
            >
              <span className="opacity-30 shrink-0">[{log.time}]</span>
              <span className="truncate">{log.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="text-[10px] text-brand-primary animate-pulse mt-2 flex gap-1">
           <span className="w-1.5 h-3 bg-brand-primary" /> _LISTENING...
        </div>
      </div>

      <div className="p-3 bg-[#0b0f19]/80 border-t border-white/5">
         <div className="flex justify-between items-center px-2">
            <span className="text-[8px] text-gray-700 font-bold uppercase tracking-widest">Memory: 42.1MB</span>
            <span className="text-[8px] text-gray-700 font-bold uppercase tracking-widest">Latency: 12ms</span>
         </div>
      </div>
    </div>
  );
}

export default DashboardTerminal;
