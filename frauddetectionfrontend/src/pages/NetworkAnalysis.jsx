import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Share2, User, Monitor, Globe, AlertOctagon, Activity } from "lucide-react";
import axios from "axios";

function NetworkAnalysis() {
  const [rings, setRings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRings = async () => {
      try {
        const res = await axios.get("http://localhost:8082/api/v1/dashboard/fraud-rings");
        setRings(res.data);
      } catch (error) {
        console.error("Failed to fetch rings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRings();
  }, []);

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <Activity className="animate-spin text-brand-primary" size={40} />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Outfit'] mb-1">Network Analysis</h1>
          <p className="text-gray-400 text-sm text-left">Identifying cross-account fraud rings via shared identifiers.</p>
        </div>
        <div className="px-4 py-2 bg-brand-accent/10 border border-brand-accent/20 rounded-xl">
          <span className="text-xs font-bold text-brand-accent uppercase tracking-widest">
            {rings.length} Active Rings Detected
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rings.map((ring, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 border-white/5 relative overflow-hidden group hover:border-brand-primary/30 transition-all"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-5 -mr-16 -mt-16 rounded-full ${
              ring.severity === 'CRITICAL' ? 'bg-brand-accent' : 'bg-brand-primary'
            }`} />

            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-2xl bg-white/5 text-brand-primary">
                {ring.type === 'DEVICE_LINK' ? <Monitor size={24} /> : <Globe size={24} />}
              </div>
              <span className={`px-2 py-1 text-[10px] font-bold rounded-lg border ${
                ring.severity === 'CRITICAL' ? 'bg-brand-accent/20 text-brand-accent border-brand-accent/30' : 'bg-brand-primary/20 text-brand-primary border-brand-primary/30'
              }`}>
                {ring.severity}
              </span>
            </div>

            <div className="space-y-1 mb-6">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Shared {ring.type === 'DEVICE_LINK' ? 'Device ID' : 'IP Address'}</p>
              <p className="text-sm font-mono text-white truncate">{ring.identifier}</p>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Connected Identities ({ring.customers.length})</p>
              <div className="flex flex-wrap gap-2">
                {ring.customers.map((cust, cidx) => (
                  <div key={cidx} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <User size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-300 font-medium">{cust}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
              <button className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1">
                <Share2 size={12} /> Graph View
              </button>
              <AlertOctagon size={16} className="text-gray-700" />
            </div>
          </motion.div>
        ))}

        {rings.length === 0 && (
          <div className="col-span-full py-20 text-center glass-card border-dashed border-2 border-white/5">
            <Share2 className="mx-auto text-gray-700 mb-4" size={48} />
            <p className="text-gray-500 italic">No suspicious network connections found at this time.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default NetworkAnalysis;
