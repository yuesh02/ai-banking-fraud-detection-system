import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  CreditCard,
  AlertTriangle,
  Activity,
  Server
} from "lucide-react";

import {
  getAlerts
} from "../../services/alertService";

function Sidebar() {

  const location =
    useLocation();

  /* -----------------------------
     Track if alerts exist
  ----------------------------- */

  const [hasAlerts,
    setHasAlerts] =
    useState(false);

  /* -----------------------------
     Check alerts every 5 sec
  ----------------------------- */

  useEffect(() => {

    const checkAlerts =
      async () => {

      try {

        const data =
          await getAlerts();

        /* Handle both paginated and list responses */

        if (data.content) {

          setHasAlerts(
            data.content.length > 0
          );

        } else {

          setHasAlerts(
            data.length > 0
          );

        }

      } catch (error) {

        console.error(
          "Alert check error:",
          error
        );

      }

    };

    checkAlerts();

    const interval =
      setInterval(
        checkAlerts,
        5000
      );

    return () =>
      clearInterval(interval);

  }, []);

  const menu = [

    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },

    {
      name: "Transactions",
      path: "/transactions",
      icon: CreditCard,
    },

    {
      name: "Alerts",
      path: "/alerts",
      icon: AlertTriangle,
    },

    {
      name: "Live Monitoring",
      path: "/live",
      icon: Activity,
    },

    {
      name: "System Health",
      path: "/system",
      icon: Server,
    },

  ];

  return (

    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col">

      {/* Logo */}

      <div className="p-6 text-xl font-bold border-b border-slate-700">

        FraudShield

      </div>

      {/* Menu */}

      <div className="flex-1 p-4 space-y-2">

        {menu.map((item) => {

          const Icon =
            item.icon;

          const active =
            location.pathname ===
            item.path;

          return (

            <Link
              key={item.name}
              to={item.path}
              className={`
                flex
                items-center
                justify-between
                px-4
                py-3
                rounded-lg
                transition
                ${
                  active
                    ? "bg-blue-600"
                    : "hover:bg-slate-800"
                }
              `}
            >

              {/* LEFT SIDE */}

              <div className="flex items-center gap-3">

                <Icon size={20} />

                <span>
                  {item.name}
                </span>

              </div>

              {/* RED DOT INDICATOR */}

              {item.name === "Alerts"
                && hasAlerts && (

                <span
                  className="
                    w-2.5
                    h-2.5
                    bg-red-500
                    rounded-full
                  "
                />

              )}

            </Link>

          );

        })}

      </div>

    </div>

  );

}

export default Sidebar;