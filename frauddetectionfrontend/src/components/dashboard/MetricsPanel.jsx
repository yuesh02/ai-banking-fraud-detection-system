/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { getMetrics } from "../../services/metricsService";
import { motion } from "framer-motion";
import { Target, Activity, ShieldCheck, Crosshair } from "lucide-react";

function MetricsPanel() {
  const [metrics, setMetrics] = useState(null);
  const [seconds, setSeconds] = useState(20);

  const fetchMetrics = async () => {
    try {
      const data = await getMetrics();
      setMetrics(data);
      setSeconds(20);
    } catch (error) {
      console.error("Metrics fetch error:", error);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => (prev === 0 ? 20 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!metrics) return null;

  return (
    <div className="bg-[#111827]/40 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-md h-full">
      <div className="flex justify-between items-center px-6 py-5 border-b border-white/5">
        <h2 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
          <Target size={14} className="text-brand-primary" /> MODEL ACCURACY METRICS
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
          <span className="text-[10px] text-gray-500 font-mono">{seconds}S</span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-3 mb-8">
          <MetricBar title="Accuracy" value={metrics.accuracy} color="brand-primary" icon={ShieldCheck} />
          <MetricBar title="Precision" value={metrics.precision} color="cyan-400" icon={Activity} />
          <MetricBar title="Recall" value={metrics.recall} color="brand-accent" icon={Crosshair} />
        </div>

        <div className="bg-[#0b0f19]/60 border border-white/5 rounded-2xl p-6">
          <h3 className="text-[10px] font-bold text-gray-500 mb-6 uppercase tracking-widest text-center">Inference Confusion Matrix</h3>

          <div className="grid grid-cols-3 gap-2">
            <div />
            <div className="text-[9px] font-bold text-gray-600 uppercase text-center pb-2">Pred: Fraud</div>
            <div className="text-[9px] font-bold text-gray-600 uppercase text-center pb-2">Pred: Safe</div>

            <div className="text-[9px] font-bold text-gray-600 uppercase flex items-center pr-2">Actual: Fraud</div>
            <MatrixCell value={metrics.truePositive} type="good" label="TP" />
            <MatrixCell value={metrics.falseNegative} type="warning" label="FN" />

            <div className="text-[9px] font-bold text-gray-600 uppercase flex items-center pr-2">Actual: Safe</div>
            <MatrixCell value={metrics.falsePositive} type="bad" label="FP" />
            <MatrixCell value={metrics.trueNegative} type="neutral" label="TN" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricBar({ title, value, color, icon: Icon }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Icon size={12} className={`text-${color}`} /> {title}
        </span>
        <span className="text-sm font-black text-white">{value.toFixed(1)}%</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full rounded-full bg-${color} shadow-[0_0_10px_rgba(var(--color-rgb),0.5)]`}
        />
      </div>
    </div>
  );
}

function MatrixCell({ value, type, label }) {
  const styles = {
    good: "bg-green-500/10 text-green-400 border-green-500/20",
    bad: "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    neutral: "bg-brand-primary/10 text-brand-primary border-brand-primary/20"
  };

  return (
    <div className={`p-4 rounded-xl border flex flex-col justify-center items-center transition-all hover:scale-[1.02] ${styles[type]}`}>
      <p className="text-xl font-black">{value}</p>
      <p className="text-[8px] font-bold uppercase tracking-tighter mt-1 opacity-50">{label}</p>
    </div>
  );
}

export default MetricsPanel;