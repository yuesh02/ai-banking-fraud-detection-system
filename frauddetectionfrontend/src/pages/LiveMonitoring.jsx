import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Terminal, Zap, Wifi, TerminalSquare, Shield, Lock, Search } from "lucide-react";

import { getLiveTransactions } from "../services/liveService";
import { getTransactionDetails } from "../services/transactionService";
import Modal from "../components/common/Modal";

function LiveMonitoring() {
  const [transactions, setTransactions] = useState([]);
  const [seconds, setSeconds] = useState(3);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [logs, setLogs] = useState([
    { id: 'init-1', msg: "SYSTEM_INITIALIZING: SECURE_CORE_ONLINE", time: new Date().toLocaleTimeString(), level: 'INFO' },
    { id: 'init-2', msg: "MODEL_LOADED: FRAUD_DETECTION_v2.4", time: new Date().toLocaleTimeString(), level: 'INFO' },
    { id: 'init-3', msg: "LISTENING_ON_PORT: 8082", time: new Date().toLocaleTimeString(), level: 'INFO' }
  ]);

  useEffect(() => {
    fetchLive();
    const interval = setInterval(fetchLive, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev === 0 ? 3 : prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchLive = async () => {
    try {
      const data = await getLiveTransactions();
      setTransactions(data);
      
      if (data.length > 0) {
        const newLogs = data.map(t => ({
          id: t.transactionId,
          msg: `>>> INGRESS [${t.transactionId}] | AMT: $${t.amount.toLocaleString()} | CUSTOMER: ${t.customerId} | RISK: ${t.riskLevel} | ACTION: ${t.riskLevel === 'HIGH' ? 'BLOCK' : 'ALLOW'}`,
          time: new Date().toLocaleTimeString(),
          level: t.riskLevel,
          raw: t
        }));
        setLogs(prev => [...newLogs, ...prev].slice(0, 50));
      }
      setSeconds(3);
    } catch (error) {
      console.error("Live fetch error:", error);
    }
  };

  const handleViewLog = async (log) => {
    if (!log.raw) return;
    try {
      const details = await getTransactionDetails(log.raw.transactionId);
      setSelectedTxn(details);
      setIsOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[calc(100vh-140px)] flex flex-col gap-4"
    >
      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center bg-[#0b0f19] p-4 rounded-2xl border border-white/5 shadow-2xl">
        <div className="flex items-center gap-4">
           <div className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary">
              <TerminalSquare size={20} />
           </div>
           <div>
              <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none">Security Firehose</h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Real-time System Audit Log</p>
           </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
             <div className="flex flex-col items-end">
                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Core Status</span>
                <span className="text-[11px] text-green-400 font-black">ENCRYPTED_LINK_ACTIVE</span>
             </div>
             <div className="h-8 w-px bg-white/5" />
             <div className="flex flex-col items-end">
                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Network latency</span>
                <span className="text-[11px] text-brand-primary font-black">12ms</span>
             </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
             <Activity className="w-3 h-3 text-brand-primary animate-pulse" />
             <span className="text-xs text-white font-mono">{seconds}S</span>
          </div>
        </div>
      </div>

      {/* ── TERMINAL LOG ────────────────────────────────────────────────────── */}
      <div className="flex-1 bg-[#05070a] border border-white/10 rounded-2xl p-6 font-mono relative overflow-hidden shadow-inner flex flex-col">
        {/* Terminal Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,118,0.02))] z-20 bg-[length:100%_4px,3px_100%]" />
        
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4 relative z-10">
           <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                 <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                 <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              <span className="text-[10px] text-gray-600 font-bold tracking-widest">GATEWAY_STREAM_v4.0.1</span>
           </div>
           <div className="flex items-center gap-2 text-[10px] text-gray-600">
              <Wifi size={10} className="text-green-500" />
              CONNECTED_TO_127.0.0.1:8082
           </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 pr-4 scrollbar-hide relative z-10">
           <AnimatePresence initial={false}>
              {logs.map((log, i) => (
                <motion.div 
                  key={log.id + i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`group flex gap-4 p-2 rounded-lg transition-colors cursor-pointer border border-transparent hover:bg-white/5 hover:border-white/10 ${
                    log.level === 'HIGH' ? 'bg-brand-accent/5 text-brand-accent' : 'text-gray-400'
                  }`}
                  onClick={() => handleViewLog(log)}
                >
                   <span className="opacity-20 shrink-0">[{log.time}]</span>
                   <span className="flex-1 text-[11px] leading-relaxed break-all">
                      {log.msg}
                   </span>
                   {log.raw && (
                     <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-brand-primary flex items-center gap-1 shrink-0">
                        <Search size={10} /> INSPECT
                     </span>
                   )}
                </motion.div>
              ))}
           </AnimatePresence>
           <div className="flex items-center gap-2 text-brand-primary text-xs mt-4 animate-pulse">
              <span className="block w-2 h-4 bg-brand-primary" />
              LISTENING_FOR_TRAFFIC...
           </div>
        </div>
      </div>

      {/* ── FOOTER STATS ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <QuickStat icon={Shield} label="Security Guard" value="ACTIVE" color="text-green-400" />
         <QuickStat icon={Lock} label="Encryption" value="AES-256" color="text-brand-primary" />
         <QuickStat icon={Zap} label="Processing" value="O(1) LATEST" color="text-amber-400" />
         <div className="bg-[#0b0f19] p-3 rounded-xl border border-white/5 flex items-center justify-center gap-2">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Auto-Refresh</span>
            <div className="w-8 h-4 bg-brand-primary/20 rounded-full relative p-1">
               <div className="w-2 h-2 bg-brand-primary rounded-full ml-auto" />
            </div>
         </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {selectedTxn && (
          <div className="space-y-6 font-mono">
            <h2 className="text-xl font-black text-white tracking-tighter border-b border-white/10 pb-4 flex items-center gap-3">
              <TerminalSquare className="text-brand-primary" /> Ingress_Detail_Dump
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailBox label="TRACE_ID" value={selectedTxn.transactionId} />
              <DetailBox label="ORIGIN_IP" value={selectedTxn.ipAddress || "HIDDEN"} />
              <DetailBox label="RISK_LEVEL" value={selectedTxn.riskLevel} highlight={selectedTxn.riskLevel === 'HIGH'} />
              <DetailBox label="NEURAL_SCORE" value={`${selectedTxn.riskScore}%`} />
            </div>

            {selectedTxn.reason && (
              <div className="bg-brand-accent/5 border border-brand-accent/20 p-5 rounded-2xl">
                <p className="text-[10px] text-brand-accent font-black uppercase mb-2 tracking-widest">Heuristic Failure Analysis</p>
                <p className="text-xs text-gray-300 leading-relaxed italic">
                  "{selectedTxn.reason}"
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
}

function QuickStat({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-[#0b0f19] p-3 rounded-xl border border-white/5 flex items-center gap-3">
       <div className={`p-1.5 rounded-lg bg-white/5 ${color}`}>
          <Icon size={14} />
       </div>
       <div>
          <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">{label}</p>
          <p className={`text-[10px] font-black ${color}`}>{value}</p>
       </div>
    </div>
  );
}

function DetailBox({ label, value, highlight }) {
  return (
    <div className="bg-[#0b0f19] p-4 rounded-xl border border-white/5">
      <p className="text-[9px] text-gray-600 font-bold uppercase mb-1">{label}</p>
      <p className={`text-xs font-bold ${highlight ? 'text-brand-accent' : 'text-white'}`}>{value}</p>
    </div>
  );
}

export default LiveMonitoring;