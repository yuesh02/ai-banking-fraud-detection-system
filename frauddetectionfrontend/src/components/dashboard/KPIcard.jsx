import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Activity } from "lucide-react";

/* 🎯 Format Values */
function formatValue(title, value) {
  if (value === null || value === undefined || isNaN(value)) {
    return "-";
  }

  if (title.toLowerCase().includes("amount")) {
    return `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  if (title.toLowerCase().includes("rate")) {
    return `${Number(value).toFixed(2)}%`;
  }

  if (title.toLowerCase().includes("score")) {
    return Number(value).toFixed(2);
  }

  return Number(value).toLocaleString("en-IN");
}

/* 🎯 Icons */
function getIcon(title) {
  if (title.includes("Transactions")) return <Activity size={18} />;
  if (title.includes("Fraud")) return <AlertTriangle size={18} />;
  if (title.includes("Amount")) return <DollarSign size={18} />;
  return <TrendingUp size={18} />;
}

/* 🎯 Background */
function getCardStyle(title) {
  if (title.includes("Transactions")) return "bg-blue-50 border-blue-100";
  if (title.includes("Fraud")) return "bg-red-50 border-red-100";
  if (title.includes("Amount")) return "bg-green-50 border-green-100";
  if (title.includes("Rate")) return "bg-yellow-50 border-yellow-100";
  if (title.includes("Score")) return "bg-purple-50 border-purple-100";
  return "bg-gray-50 border-gray-100";
}

/* 🎯 Animated Counter */
function useCountUp(value, duration = 800) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!value || isNaN(value)) return;

    let start = 0;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        start = value;
        clearInterval(timer);
      }
      setDisplay(start);
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return display;
}

function KPIcard({ title, value, trend = 0 }) {

  const animatedValue = useCountUp(Number(value));

  const isPositive = trend >= 0;

  return (
    <div
      className={`
        rounded-xl p-4 border shadow-sm
        hover:shadow-md transition
        ${getCardStyle(title)}
      `}
    >

      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-600 text-xs font-medium truncate">
          {title}
        </h3>
        <div className="text-gray-500">
          {getIcon(title)}
        </div>
      </div>

      {/* Value */}
      <p className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight">
        {formatValue(title, animatedValue)}
      </p>

      {/* Trend */}
      <div className="flex items-center mt-2 text-xs">
        <span
          className={`flex items-center gap-1 ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {Math.abs(trend)}%
        </span>

        <span className="text-gray-400 ml-2">
          vs last period
        </span>
      </div>

    </div>
  );
}

export default KPIcard;