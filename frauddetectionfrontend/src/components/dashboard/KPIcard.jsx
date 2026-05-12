import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Activity } from "lucide-react";
import { motion } from "framer-motion";

function formatValue(title, value) {
  if (value === null || value === undefined || isNaN(value)) {
    return "-";
  }
  if (title.toLowerCase().includes("amount") || title.toLowerCase().includes("exposure")) {
    return `$ ${Number(value).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  if (title.toLowerCase().includes("rate")) {
    return `${Number(value).toFixed(2)}%`;
  }
  if (title.toLowerCase().includes("score")) {
    return Number(value).toFixed(1);
  }
  return Number(value).toLocaleString("en-US");
}

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

function KPIcard({ title, value, trend = 0, delay = 0, icon: Icon, color = "brand-primary" }) {
  const animatedValue = useCountUp(Number(value));
  const isPositive = trend >= 0;

  // Determine if high trend is "good" or "bad"
  const isGood = (title.toLowerCase().includes("fraud") || title.toLowerCase().includes("attack") || title.toLowerCase().includes("risk")) 
    ? !isPositive 
    : isPositive;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-[#1e293b]/20 backdrop-blur-md p-6 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all duration-300"
    >
      <div className={`absolute -right-8 -top-8 w-32 h-32 bg-${color}/5 rounded-full blur-2xl group-hover:bg-${color}/10 transition-colors duration-500`} />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`p-3 rounded-2xl bg-${color}/10 text-${color}`}>
          {Icon ? <Icon size={20} /> : <Activity size={20} />}
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${isGood ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
          {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {Math.abs(trend)}%
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-gray-500 text-[11px] font-bold uppercase tracking-widest mb-1">
          {title}
        </h3>
        <p className="text-3xl font-black text-white tracking-tight">
          {formatValue(title, animatedValue)}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2 relative z-10">
        <div className="flex -space-x-2">
          {[1,2,3].map(i => (
            <div key={i} className="w-4 h-4 rounded-full border border-[#0b0f19] bg-gray-700" />
          ))}
        </div>
        <span className="text-[10px] text-gray-500 font-medium">Real-time aggregate</span>
      </div>
    </motion.div>
  );
}

export default KPIcard;