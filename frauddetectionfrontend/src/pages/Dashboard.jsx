import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, ShieldAlert, Zap, Globe, BarChart3, Lock } from "lucide-react";

import KPIcard from "../components/dashboard/KPIcard";
import FraudTrendChart from "../components/dashboard/FraudTrendChart";
import RiskDistributionChart from "../components/dashboard/RiskDistributionChart";
import SystemHealthWidget from "../components/dashboard/SystemHealthWidget";
import TopRiskyMerchantsChart from "../components/dashboard/TopRiskyMerchantsChart";
import RiskByCountryChart from "../components/dashboard/RiskByCountryChart";
import MetricsPanel from "../components/dashboard/MetricsPanel";
import DashboardTerminal from "../components/dashboard/DashboardTerminal";

import {
  getSummary,
  getFraudTrend,
  getRiskDistribution
} from "../services/dashboardService";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [riskData, setRiskData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, trendData, riskDist] = await Promise.all([
          getSummary(),
          getFraudTrend(),
          getRiskDistribution()
        ]);
        setSummary(summaryData);
        setTrend(trendData);
        setRiskData(riskDist);
        setLoading(false);
      } catch (error) {
        console.error("Dashboard error:", error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !summary) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0b0f19]">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative"
        >
          <div className="absolute inset-0 bg-brand-primary blur-2xl opacity-20" />
          <Activity className="w-12 h-12 text-brand-primary relative z-10" />
        </motion.div>
        <p className="mt-6 text-gray-400 font-medium tracking-widest uppercase text-xs">Initializing Neural Engine...</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-12"
    >
      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-brand-primary rounded-full" />
            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em]">Security Nexus</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Security <span className="text-brand-primary">Command</span> Center
          </h1>
          <p className="text-gray-400 text-sm max-w-md mt-1">
            Real-time heuristic analysis and machine learning-backed fraud orchestration.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-[#1e293b]/30 p-2 pr-4 rounded-2xl border border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-xl border border-green-500/20 text-xs font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            SYSTEMS LIVE
          </div>
          <div className="text-[11px] text-gray-500 font-mono">NODE_UP: 8082_SSL</div>
        </div>
      </div>

      {/* ── KPI GRID ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <KPIcard title="Total Volume" value={summary.totalTransactions} icon={BarChart3} delay={0.1} color="brand-primary" />
        <KPIcard title="Threats Prevented" value={summary.totalFrauds} icon={ShieldAlert} delay={0.2} color="brand-accent" />
        <KPIcard title="Attack Rate" value={summary.fraudRate} icon={Zap} delay={0.3} color="amber-400" />
        <KPIcard title="Exposure Risk" value={summary.totalAmount} icon={Globe} delay={0.4} color="brand-primary" />
        <KPIcard title="Intelligence Score" value={summary.averageRiskScore} icon={Lock} delay={0.5} color="cyan-400" />
      </div>

      {/* ── SYSTEM STATUS RIBBON ───────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
        <SystemHealthWidget />
      </motion.div>

      {/* ── PRIMARY ANALYTICS ROW ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-8 bg-[#111827]/40 p-6 rounded-3xl border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity size={16} className="text-brand-primary" /> THREAT PROPAGATION TREND
            </h3>
            <div className="flex gap-2">
              <div className="px-2 py-1 bg-white/5 rounded-md text-[10px] text-gray-400">24H</div>
              <div className="px-2 py-1 bg-brand-primary/20 rounded-md text-[10px] text-brand-primary font-bold">LIVE</div>
            </div>
          </div>
          <FraudTrendChart data={trend} />
        </motion.div>
        
        <motion.div variants={itemVariants} className="lg:col-span-4 bg-[#111827]/40 p-6 rounded-3xl border border-white/5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6">
            <ShieldAlert size={16} className="text-brand-accent" /> RISK CLASSIFICATION
          </h3>
          <RiskDistributionChart data={riskData} />
        </motion.div>
      </div>

      {/* ── TERMINAL LOG & METRICS ROW ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-8 h-full min-h-[400px]">
           <DashboardTerminal />
        </motion.div>
        
        <motion.div variants={itemVariants} className="lg:col-span-4">
           <MetricsPanel />
        </motion.div>
      </div>

      {/* ── SECONDARY INTELLIGENCE ROW ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-6 bg-[#111827]/40 p-6 rounded-3xl border border-white/5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6">
            <Globe size={16} className="text-brand-primary" /> GEOGRAPHIC RISK HEATMAP
          </h3>
          <div className="h-full min-h-[300px]">
             <RiskByCountryChart />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-6 bg-[#111827]/40 p-6 rounded-3xl border border-white/5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6">
            <ShieldAlert size={16} className="text-brand-accent" /> HIGH-RISK VENDORS
          </h3>
          <TopRiskyMerchantsChart />
        </motion.div>
      </div>

    </motion.div>
  );
}

export default Dashboard;