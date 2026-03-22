import { useEffect, useState } from "react";

import {
  getSystemHealth
} from "../../services/systemService";

function SystemHealthWidget() {

  const [health,
    setHealth] = useState(null);

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

  const fetchHealth =
    async () => {

    try {

      const data =
        await getSystemHealth();

      setHealth(data);

    } catch (error) {

      console.error(error);

    }

  };

  if (!health)
    return null;

  const isUp =
    health.status === "UP";

  const isDbUp =
    health.database ===
    "CONNECTED";

  return (

    <div className="bg-white shadow rounded-xl p-5 mt-6">

      <h2 className="text-lg font-semibold mb-4">
        System Health
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div>

          <div className="text-sm text-gray-500">
            System Status
          </div>

          <span
            className={`
              px-3 py-1
              rounded-full
              text-white
              text-sm
              ${
                isUp
                  ? "bg-green-500"
                  : "bg-red-500"
              }
            `}
          >
            {health.status}
          </span>

        </div>

        <div>

          <div className="text-sm text-gray-500">
            Database
          </div>

          <span
            className={`
              px-3 py-1
              rounded-full
              text-white
              text-sm
              ${
                isDbUp
                  ? "bg-green-500"
                  : "bg-red-500"
              }
            `}
          >
            {health.database}
          </span>

        </div>

        <div>

          <div className="text-sm text-gray-500">
            Last Checked
          </div>

          <div>

            {new Date(
              health.timestamp
            ).toLocaleString()}

          </div>

        </div>

      </div>

    </div>

  );

}

export default SystemHealthWidget;