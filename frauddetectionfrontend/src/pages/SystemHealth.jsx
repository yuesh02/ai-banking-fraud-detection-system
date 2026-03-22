import { useEffect, useState } from "react";

import {
  getSystemHealth
} from "../services/systemService";

import StatusCard from
  "../components/system/StatusCard";

function SystemHealth() {

  const [health,
    setHealth] = useState(null);

  const [seconds,
    setSeconds] = useState(10);

  /* -----------------------------
     Fetch system health
  ----------------------------- */

  useEffect(() => {

    fetchHealth();

    const interval =
      setInterval(
        fetchHealth,
        10000
      );

    return () =>
      clearInterval(interval);

  }, []);

  /* -----------------------------
     Countdown timer
  ----------------------------- */

  useEffect(() => {

    const timer =
      setInterval(() => {

        setSeconds(prev =>
          prev === 0 ? 10 : prev - 1
        );

      }, 1000);

    return () =>
      clearInterval(timer);

  }, []);

  const fetchHealth =
    async () => {

    try {

      const data =
        await getSystemHealth();

      setHealth(data);

      setSeconds(10);

    } catch (error) {

      console.error(
        "Health fetch error:",
        error
      );

    }

  };

  if (!health)
    return (
      <div>
        Loading system health...
      </div>
    );

  return (

    <div>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          System Health
        </h1>

        <div className="text-sm text-gray-500">

          Refreshing in

          <span className="font-bold ml-1">
            {seconds}s
          </span>

        </div>

      </div>

      {/* STATUS GRID */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <StatusCard
          title="System Status"
          status={health.status}
        />

        <StatusCard
          title="Database"
          status={health.database}
        />

        <StatusCard
          title="Last Checked"
          status="INFO"
          value={
            new Date(
              health.timestamp
            ).toLocaleString()
          }
        />

      </div>

    </div>

  );

}

export default SystemHealth;