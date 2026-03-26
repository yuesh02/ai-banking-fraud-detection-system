/* eslint-disable react-hooks/set-state-in-effect */
import { Clock, Database, Server } from "lucide-react";
import { useEffect, useState } from "react";

import { getSystemHealth } from "../../services/systemService";

function SystemHealthWidget() {

  const [health, setHealth] = useState(null);
  const [pulse, setPulse] = useState(false); // 🔥 live effect

  const fetchHealth = async () => {
    try {
      const data = await getSystemHealth();
      setHealth(data);

      // 🔥 trigger pulse animation
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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mt-6 p-5 transition-all duration-300">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-base font-semibold text-gray-800">
          System Health
        </h2>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span
            className={`
              w-2 h-2 rounded-full
              ${pulse ? "bg-green-500 animate-ping" : "bg-green-500"}
            `}
          ></span>
          Live
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* System Status */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">System Status</p>
            <p
              className={`font-semibold mt-1 ${
                isUp ? "text-green-600" : "text-red-600"
              }`}
            >
              {health.status}
            </p>
          </div>

          <div
            className={`p-2 rounded-lg ${
              isUp ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
          >
            <Server size={18} />
          </div>
        </div>

        {/* Database */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Database</p>
            <p
              className={`font-semibold mt-1 ${
                isDbUp ? "text-green-600" : "text-red-600"
              }`}
            >
              {health.database}
            </p>
          </div>

          <div
            className={`p-2 rounded-lg ${
              isDbUp ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
          >
            <Database size={18} />
          </div>
        </div>

        {/* Last Checked */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Last Checked</p>
            <p className="text-gray-700 text-sm mt-1">
              {new Date(health.timestamp).toLocaleString()}
            </p>
          </div>

          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
            <Clock size={18} />
          </div>
        </div>

      </div>

    </div>
  );
}

export default SystemHealthWidget;