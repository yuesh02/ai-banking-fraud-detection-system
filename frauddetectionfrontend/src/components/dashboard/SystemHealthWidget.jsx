/* eslint-disable react-hooks/set-state-in-effect */
import { Clock, Database, Server } from "lucide-react";
import { useEffect, useState } from "react";
import { getSystemHealth } from "../../services/systemService";

function SystemHealthWidget() {
  const [health, setHealth] = useState(null);
  const [pulse, setPulse] = useState(false);

  const fetchHealth = async () => {
    try {
      const data = await getSystemHealth();
      setHealth(data);
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!health) return null;

  const isUp = health.status === "UP";
  const isDbUp = health.database === "CONNECTED";

  return (
    <div className="glass-card rounded-2xl border border-white/5 shadow-sm p-5 transition-all duration-300">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-base font-semibold text-white">System Health</h2>
        <div className="flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
          <span className={`w-2 h-2 rounded-full ${pulse ? "bg-green-400 animate-ping" : "bg-green-400"}`}></span>
          Live
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* System Status */}
        <div className="bg-[#1e293b]/50 rounded-xl p-4 border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">System Status</p>
            <p className={`font-bold mt-1 ${isUp ? "text-green-400" : "text-brand-accent"}`}>
              {health.status}
            </p>
          </div>
          <div className={`p-2.5 rounded-xl ${isUp ? "bg-green-500/10 text-green-400" : "bg-brand-accent/10 text-brand-accent"}`}>
            <Server size={20} />
          </div>
        </div>

        {/* Database */}
        <div className="bg-[#1e293b]/50 rounded-xl p-4 border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Database</p>
            <p className={`font-bold mt-1 ${isDbUp ? "text-green-400" : "text-brand-accent"}`}>
              {health.database}
            </p>
          </div>
          <div className={`p-2.5 rounded-xl ${isDbUp ? "bg-green-500/10 text-green-400" : "bg-brand-accent/10 text-brand-accent"}`}>
            <Database size={20} />
          </div>
        </div>

        {/* Last Checked */}
        <div className="bg-[#1e293b]/50 rounded-xl p-4 border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Last Checked</p>
            <p className="text-gray-300 text-sm mt-1 font-medium">
              {new Date(health.timestamp).toLocaleTimeString()}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary">
            <Clock size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemHealthWidget;