import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, CreditCard, AlertTriangle, Activity, Server, ShieldCheck, ClipboardList, Beaker, Share2, Power } from "lucide-react";
import { getAlerts } from "../../services/alertService";
import { getReviewQueue } from "../../services/transactionService";

function Sidebar() {
  const location = useLocation();
  const [hasAlerts, setHasAlerts] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const checkAlerts = async () => {
      try {
        const data = await getAlerts();
        if (data.content) {
          setHasAlerts(data.content.length > 0);
        } else {
          setHasAlerts(data.length > 0);
        }
      } catch (error) {
        console.error("Alert check error:", error);
      }
    };
    checkAlerts();
    const interval = setInterval(checkAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkReviewQueue = async () => {
      try {
        const data = await getReviewQueue();
        setReviewCount(Array.isArray(data) ? data.length : 0);
      } catch (error) {
        console.error("Review queue check error:", error);
      }
    };
    checkReviewQueue();
    const interval = setInterval(checkReviewQueue, 15000);
    return () => clearInterval(interval);
  }, []);

  const menu = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Transactions", path: "/transactions", icon: CreditCard },
    { name: "Case Queue", path: "/cases", icon: ClipboardList },
    { name: "Simulator Lab", path: "/lab", icon: Beaker },
    { name: "Network Analysis", path: "/network", icon: Share2 },
    { name: "Security Control", path: "/system-control", icon: Power },
    { name: "Alerts", path: "/alerts", icon: AlertTriangle },
    { name: "Live Monitoring", path: "/live", icon: Activity },
    { name: "System Health", path: "/system", icon: Server },
  ];

  return (
    <div className="w-64 h-screen bg-[#0b0f19] border-r border-white/5 flex flex-col relative z-20">
      
      {/* Sidebar background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111827]/80 to-[#0b0f19] pointer-events-none" />

      {/* Logo */}
      <div className="h-20 flex items-center px-6 relative z-10 border-b border-white/5">
        <motion.div 
          initial={{ rotate: -10, scale: 0.9 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="text-xl font-bold text-white tracking-wide font-['Outfit']">
            Fraud<span className="text-brand-secondary">Shield</span>
          </div>
        </motion.div>
      </div>

      {/* Menu */}
      <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto relative z-10 scrollbar-hide">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Main Menu</div>
        {menu.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`relative flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${
                active ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active-bg"
                  className="absolute inset-0 bg-white/10 border border-white/10 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              {!active && (
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              )}

              <div className="relative flex items-center gap-3 z-10">
                <div className={`p-1.5 rounded-lg transition-colors ${active ? "bg-brand-primary/20 text-brand-primary" : "text-gray-500 group-hover:text-gray-300"}`}>
                  <Icon size={18} />
                </div>
                <span className={`text-sm font-medium transition-colors ${active ? "font-semibold" : ""}`}>
                  {item.name}
                </span>
              </div>

              {item.name === "Alerts" && hasAlerts && (
                <div className="relative flex h-2.5 w-2.5 z-10">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-accent shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
                </div>
              )}

              {item.name === "Case Queue" && reviewCount > 0 && (
                <div className="relative flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full bg-amber-500/20 border border-amber-500/30 z-10">
                  <span className="text-[10px] font-bold text-amber-400">{reviewCount}</span>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 relative z-10">
        <div className="glass-card p-4 rounded-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-xs font-medium text-gray-300">System Online</span>
          </div>
          <div className="text-[10px] text-gray-500">v2.0 • AI Detection Core</div>
        </div>
      </div>

    </div>
  );
}

export default Sidebar;