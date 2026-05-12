import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Unlock, RefreshCcw, Power, AlertTriangle, CheckCircle } from "lucide-react";
import axios from "axios";

function SystemControl() {
  const [freezes, setFreezes] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchFreezes = async () => {
    try {
      const res = await axios.get("http://localhost:8082/api/v1/system/freezes");
      setFreezes(res.data);
    } catch (error) {
      console.error("Failed to fetch freezes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfreeze = async (merchantId) => {
    try {
      await axios.delete(`http://localhost:8082/api/v1/system/freezes/${merchantId}`);
      fetchFreezes();
    } catch (error) {
      console.error("Failed to unfreeze:", error);
    }
  };

  useEffect(() => {
    fetchFreezes();
    const interval = setInterval(fetchFreezes, 10000);
    return () => clearInterval(interval);
  }, []);

  const merchantIds = Object.keys(freezes);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Outfit'] mb-1">Security Control Center</h1>
          <p className="text-gray-400 text-sm text-left">Manage automated system responses and merchant kill-switches.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Guard Active</span>
          </div>
          <button 
            onClick={fetchFreezes}
            className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg transition-colors"
          >
            <RefreshCcw size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* System Stats Section */}
        <div className="lg:col-span-1 space-y-4">
          <StatusCard title="Kill-Switch Status" value="Operational" status="active" />
          <StatusCard title="Fraud Velocity" value="Nominal" status="good" />
          <StatusCard title="Active Freezes" value={merchantIds.length} status={merchantIds.length > 0 ? "warning" : "good"} />
        </div>

        {/* Freezes List Section */}
        <div className="lg:col-span-3">
          <div className="glass-card min-h-[400px] border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary/50 to-brand-secondary/50" />
            
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Power className="text-brand-accent" size={20} />
                Global Merchant Freezes
              </h3>
            </div>

            <div className="p-6">
              {merchantIds.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                    <CheckCircle className="text-green-500" size={32} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">All Clear</h4>
                    <p className="text-gray-500 text-sm italic">No merchants are currently hitting the automated kill-switch threshold.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {merchantIds.map((id) => (
                    <motion.div 
                      key={id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-brand-accent/5 border border-brand-accent/20 rounded-2xl group hover:bg-brand-accent/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                          <ShieldAlert size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{id}</p>
                          <p className="text-[10px] text-brand-accent/80 uppercase tracking-widest mt-0.5">
                            Auto-Frozen until {new Date(freezes[id]).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleUnfreeze(id)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-green-500/20 text-xs font-bold text-gray-400 hover:text-green-400 border border-white/10 hover:border-green-500/30 rounded-xl transition-all"
                      >
                        <Unlock size={14} />
                        Manual Override
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 bg-white/[0.01] border-t border-white/5">
              <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                <AlertTriangle className="text-amber-500 shrink-0" size={18} />
                <p className="text-[11px] text-amber-500/80 leading-relaxed italic">
                  <b>Auto-Freeze Protocol:</b> A merchant is globally frozen if they hit more than 5 fraud blocks in a 10-minute window. 
                  Freezes last 30 minutes unless manually cleared by an authorized admin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatusCard({ title, value, status }) {
  const colors = {
    active: "text-brand-primary",
    good: "text-green-400",
    warning: "text-brand-accent"
  };

  return (
    <div className="glass-card p-5 border-white/5 flex flex-col justify-between h-32 relative overflow-hidden group">
       <div className={`absolute -right-4 -top-4 w-12 h-12 rounded-full blur-xl opacity-10 bg-current ${colors[status]}`} />
       <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{title}</p>
       <p className={`text-2xl font-bold ${colors[status]}`}>{value}</p>
    </div>
  );
}

export default SystemControl;
