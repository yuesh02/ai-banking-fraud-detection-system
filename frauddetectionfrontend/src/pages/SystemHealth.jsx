import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Server, Activity } from "lucide-react";

import { getSystemHealth } from "../services/systemService";
import StatusCard from "../components/system/StatusCard";

function SystemHealth() {
  const [health, setHealth] = useState(null);
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev === 0 ? 10 : prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchHealth = async () => {
    try {
      const data = await getSystemHealth();
      setHealth(data);
      setSeconds(10);
    } catch (error) {
      console.error("Health fetch error:", error);
    }
  };

  if (!health)
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Server className="w-8 h-8 text-brand-primary animate-pulse mb-4" />
        <p className="text-gray-400 font-medium">Checking System Vitals...</p>
      </div>
    );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Outfit'] mb-1">
            System Health
          </h1>
          <p className="text-gray-400 text-sm">Monitor backend services and infrastructure status.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
          <Activity className="w-4 h-4 text-green-400 animate-pulse" />
          <span className="text-sm text-gray-300">
            Refreshing in <span className="font-bold text-white w-4 inline-block text-center">{seconds}</span>s
          </span>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`p-5 rounded-2xl border ${health.status === 'UP' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}
          >
            <p className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-semibold">System Status</p>
            <p className={`text-2xl font-bold ${health.status === 'UP' ? 'text-green-400' : 'text-red-400'}`}>
              {health.status}
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`p-5 rounded-2xl border ${health.database === 'UP' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-red-500/10 border-red-500/20'}`}
          >
            <p className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-semibold">Database</p>
            <p className={`text-2xl font-bold ${health.database === 'UP' ? 'text-blue-400' : 'text-red-400'}`}>
              {health.database}
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-5 rounded-2xl border bg-brand-primary/10 border-brand-primary/20"
          >
            <p className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-semibold">Last Checked</p>
            <p className="text-lg font-bold text-brand-primary mt-1">
              {new Date(health.timestamp).toLocaleTimeString()}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default SystemHealth;