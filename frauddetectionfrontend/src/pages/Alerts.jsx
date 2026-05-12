import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Activity } from "lucide-react";

import { getAlerts } from "../services/alertService";
import AlertBadge from "../components/common/AlertBadge";
import Modal from "../components/common/Modal";
import { getTransactionDetails } from "../services/transactionService";

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [alertCount, setAlertCount] = useState(0);
  const [previousIds, setPreviousIds] = useState([]);
  const [seconds, setSeconds] = useState(5);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev === 0 ? 5 : prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    window.alertCount = alertCount;
  }, [alertCount]);

  const fetchAlerts = async () => {
    try {
      const data = await getAlerts();
      setAlertCount(data.totalElements || data.length || 0);

      const content = data.content ? data.content : data;
      const newIds = content.map(a => a.transactionId);

      setPreviousIds(prev => {
        const newAlerts = newIds.filter(id => !prev.includes(id));
        if (newAlerts.length > 0) {
          console.log("New alerts detected:", newAlerts);
        }
        return newIds;
      });

      setAlerts(content);
      setSeconds(5);
    } catch (error) {
      console.error(error);
    }
  };

  const handleView = async (transactionId) => {
    try {
      const details = await getTransactionDetails(transactionId);
      setSelectedTxn(details);
      setIsOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

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
            Real-Time Alerts
          </h1>
          <p className="text-gray-400 text-sm">Active threat detections requiring attention.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
          <Activity className="w-4 h-4 text-brand-primary animate-pulse" />
          <span className="text-sm text-gray-300">
            Refreshing in <span className="font-bold text-white w-4 inline-block text-center">{seconds}</span>s
          </span>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {alerts.map((alert, index) => {
              const isNew = !previousIds.includes(alert.transactionId);
              const isHigh = alert.riskLevel === "HIGH";

              return (
                <motion.div
                  key={alert.transactionId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`relative overflow-hidden border rounded-2xl p-5 shadow-lg flex flex-col justify-between ${
                    isHigh 
                      ? "bg-brand-accent/5 border-brand-accent/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]" 
                      : "bg-[#1e293b]/50 border-white/10"
                  }`}
                >
                  {isHigh && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-accent to-red-600" />
                  )}
                  {isNew && (
                    <div className="absolute inset-0 bg-green-500/5 animate-pulse pointer-events-none" />
                  )}

                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <p className="text-lg font-bold text-white font-['Outfit']">
                        UUID: {alert.transactionId}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {alert.customerId}
                      </p>
                    </div>
                    <AlertBadge level={alert.riskLevel} />
                  </div>

                  <div className="my-4 relative z-10">
                    <p className="text-sm text-gray-300 font-medium">
                      {alert.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-auto relative z-10">
                    <div className="flex gap-2">
                      {isNew && (
                        <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded-md border border-green-500/20">
                          NEW
                        </span>
                      )}
                      {isHigh && (
                        <span className="text-[10px] font-bold bg-brand-accent/20 text-brand-accent px-2 py-1 rounded-md border border-brand-accent/20">
                          CRITICAL
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleView(alert.transactionId)}
                      className="px-4 py-2 text-xs font-semibold bg-white/10 hover:bg-brand-primary/20 text-white rounded-lg transition-colors border border-white/5 hover:border-brand-primary/30"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {alerts.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No active alerts at this moment.</p>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {selectedTxn && (
          <div className="space-y-6 text-gray-200">
            <h2 className="text-xl font-bold text-white font-['Outfit'] border-b border-white/10 pb-4">
              Alert Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <p className="text-xs text-gray-400 uppercase">ID</p>
                <p className="font-semibold text-white mt-1">{selectedTxn.transactionId}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <p className="text-xs text-gray-400 uppercase">Customer</p>
                <p className="font-semibold text-white mt-1">{selectedTxn.customerId}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <p className="text-xs text-gray-400 uppercase">Amount</p>
                <p className="font-semibold text-brand-secondary mt-1">${selectedTxn.amount}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <p className="text-xs text-gray-400 uppercase">Risk Level</p>
                <p className={`font-bold mt-1 ${selectedTxn.riskLevel === 'HIGH' ? 'text-brand-accent' : 'text-yellow-400'}`}>
                  {selectedTxn.riskLevel}
                </p>
              </div>
            </div>

            {selectedTxn.reason && (
              <div className="mt-6 bg-brand-accent/10 border border-brand-accent/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-brand-accent" />
                  <b className="text-sm text-brand-accent uppercase tracking-wider">Fraud Reason</b>
                </div>
                <div className="text-sm text-gray-300">
                  {selectedTxn.reason}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
}

export default Alerts;