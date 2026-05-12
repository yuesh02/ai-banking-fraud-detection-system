import { createContext, useState, useEffect, useCallback } from "react";
import apiClient from "../api/apiClient";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [hasNewHighRisk, setHasNewHighRisk] = useState(false);
  const [lastAlertCount, setLastAlertCount] = useState(0);

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await apiClient.get("/dashboard/alerts");
      const newAlerts = res.data;
      
      if (newAlerts.length > lastAlertCount) {
        // Check if any of the NEW alerts are HIGH risk
        const latest = newAlerts.slice(0, newAlerts.length - lastAlertCount);
        const critical = latest.some(a => a.riskLevel === 'HIGH');
        
        if (critical) {
          setHasNewHighRisk(true);
          // Auto-reset pulse after 5 seconds
          setTimeout(() => setHasNewHighRisk(false), 5000);
        }
      }
      
      setAlerts(newAlerts);
      setLastAlertCount(newAlerts.length);
    } catch (error) {
      console.error("Alert fetch error:", error);
    }
  }, [lastAlertCount]);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  const clearNotifications = () => {
    setHasNewHighRisk(false);
  };

  return (
    <NotificationContext.Provider value={{ 
      alerts, 
      hasNewHighRisk, 
      clearNotifications,
      unreadCount: alerts.length 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
