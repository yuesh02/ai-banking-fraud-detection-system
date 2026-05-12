import { ChevronDown, LogOut, Bell, Search, ShieldAlert, Clock } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthContext from "../../context/AuthContext";
import NotificationContext from "../../context/NotificationContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { alerts, hasNewHighRisk, unreadCount, clearNotifications } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) clearNotifications();
  };

  return (
    <header className="h-20 bg-[#0b0f19]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-64 hidden md:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-brand-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search Intelligence..." 
            className="w-full bg-[#1e293b]/40 border border-white/5 rounded-2xl py-2 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-gray-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* BELL NOTIFICATION */}
        <div className="relative">
          <motion.button 
            onClick={handleToggleNotifications}
            animate={hasNewHighRisk ? { 
              scale: [1, 1.3, 1],
              rotate: [0, 10, -10, 0]
            } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
            className={`relative p-2.5 rounded-2xl transition-all ${
                hasNewHighRisk ? 'bg-brand-accent/20 text-brand-accent' : 'hover:bg-white/5 text-gray-400'
            }`}
          >
            <Bell size={20} className={hasNewHighRisk ? "animate-pulse" : ""} />
            {unreadCount > 0 && (
              <span className={`absolute top-2 right-2 w-4 h-4 text-[9px] font-black flex items-center justify-center rounded-full border-2 border-[#0b0f19] ${
                  hasNewHighRisk ? 'bg-brand-accent text-white' : 'bg-brand-primary text-white'
              }`}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="absolute right-0 mt-4 w-80 bg-[#0b0f19] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50"
              >
                <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Active Alerts</span>
                  <Link to="/alerts" onClick={() => setShowNotifications(false)} className="text-[10px] text-brand-primary font-bold hover:underline">View All</Link>
                </div>
                
                <div className="max-h-[350px] overflow-y-auto scrollbar-hide">
                  {alerts.length === 0 ? (
                    <div className="p-10 text-center text-gray-600 text-xs italic">No new threats detected.</div>
                  ) : (
                    alerts.slice(0, 5).map((alert) => (
                      <div key={alert.id} className="px-5 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                        <div className="flex gap-3">
                          <div className={`p-2 rounded-xl shrink-0 ${alert.riskLevel === 'HIGH' ? 'bg-brand-accent/10 text-brand-accent' : 'bg-yellow-500/10 text-yellow-500'}`}>
                            <ShieldAlert size={14} />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-white group-hover:text-brand-primary transition-colors line-clamp-1">{alert.reason || "Fraudulent Transaction Detected"}</p>
                            <div className="flex items-center gap-3 mt-1">
                               <span className="text-[9px] text-gray-500 flex items-center gap-1"><Clock size={10} /> Just now</span>
                               <span className={`text-[9px] font-black uppercase ${alert.riskLevel === 'HIGH' ? 'text-brand-accent' : 'text-yellow-500'}`}>
                                  {alert.riskLevel}
                               </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* USER PROFILE */}
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-2xl border border-white/5 bg-[#1e293b]/30 hover:bg-[#1e293b]/50 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary text-white flex items-center justify-center text-sm font-black shadow-lg">
              {user?.username?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-[11px] font-black text-gray-200 uppercase tracking-tight">{user?.username || "Admin"}</div>
              <div className="text-[9px] text-brand-secondary font-bold uppercase tracking-widest">{user?.role || "Chief_Officer"}</div>
            </div>
            <ChevronDown size={14} className="text-gray-500 ml-1" />
          </motion.div>

          <AnimatePresence>
            {open && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-48 bg-[#0b0f19] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-1 z-50"
              >
                <div className="px-4 py-3 border-b border-white/5 mb-1">
                  <p className="text-xs text-white font-black uppercase">{user?.username || "Admin"}</p>
                  <p className="text-[10px] text-gray-500 truncate mt-1">{user?.email || "admin@fraudshield.io"}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-[11px] font-bold text-red-400 hover:bg-red-500/10 transition-colors uppercase"
                >
                  <LogOut size={14} />
                  Logout Session
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default Navbar;