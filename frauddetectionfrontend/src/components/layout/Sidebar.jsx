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

  <div className="
    w-64 h-screen
    bg-linear-to-b from-slate-900 via-slate-800 to-slate-900
    text-white
    flex flex-col
    border-r border-slate-700
  ">

    {/* 🔥 Logo */}
    <div className="
      px-6 py-5
      text-lg font-semibold
      border-b border-slate-700
      tracking-wide
    ">
      Fraud<span className="text-indigo-400">Shield</span>
    </div>

    {/* MENU */}
    <div className="flex-1 px-3 py-4 space-y-2">

      {menu.map((item) => {

        const Icon = item.icon;
        const active = location.pathname === item.path;

        return (

          <Link
            key={item.name}
            to={item.path}
            className={`
              relative flex items-center justify-between
              px-4 py-3 rounded-xl
              transition-all duration-200

              ${active
                ? "bg-indigo-600 shadow-md"
                : "hover:bg-slate-800"
              }
            `}
          >

            {/* ACTIVE LEFT BAR */}
            {active && (
              <span className="
                absolute left-0 top-0 h-full w-1
                bg-indigo-400 rounded-r
              " />
            )}

            {/* LEFT */}
            <div className="flex items-center gap-3">

              <Icon
                size={20}
                className={`
                  transition
                  ${active
                    ? "text-white"
                    : "text-slate-300 group-hover:text-white"
                  }
                `}
              />

              <span className="text-sm font-medium">
                {item.name}
              </span>

            </div>

            {/* 🔴 ALERT INDICATOR */}
            {item.name === "Alerts" && hasAlerts && (
              <span className="
                relative flex h-2.5 w-2.5
              ">
                <span className="
                  animate-ping absolute inline-flex h-full w-full
                  rounded-full bg-red-400 opacity-75
                "></span>
                <span className="
                  relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500
                "></span>
              </span>
            )}

          </Link>

        );

      })}

    </div>

    {/* 🔥 FOOTER */}
    <div className="
      px-6 py-4 text-xs text-slate-400
      border-t border-slate-700
    ">
      v1.0 • Fraud Detection System
    </div>

  </div>

);

}

export default Sidebar;