import { useEffect, useState } from "react";

import KPIcard from "../components/dashboard/KPIcard";
import FraudTrendChart from "../components/dashboard/FraudTrendChart";
import RiskDistributionChart from "../components/dashboard/RiskDistributionChart";
import SystemHealthWidget from "../components/dashboard/SystemHealthWidget";
import TopRiskyMerchantsChart from "../components/dashboard/TopRiskyMerchantsChart";
import RiskByCountryChart from "../components/dashboard/RiskByCountryChart";
import MetricsPanel from "../components/dashboard/MetricsPanel";
import RecentTransactions from "../components/dashboard/RecentTransactions";

import {
  getSummary,
  getFraudTrend,
  getRiskDistribution
} from "../services/dashboardService";

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
    }
  };

  fetchData(); // ✅ no warning now

  const interval = setInterval(() => {
    fetchData();
  }, 10000);

  return () => clearInterval(interval);

}, []);

  if (loading || !summary) {
    return (
      <div className="p-6">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">

        <KPIcard title="Total Transactions" value={summary.totalTransactions} trend={12} />
        <KPIcard title="Total Frauds" value={summary.totalFrauds} trend={-5} />
        <KPIcard title="Fraud Rate" value={summary.fraudRate} trend={-2} />
        <KPIcard title="Total Amount" value={summary.totalAmount} trend={8} />
        <KPIcard title="Average Risk Score" value={summary.averageRiskScore} trend={3} />

      </div>

      {/* CHARTS */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <FraudTrendChart data={trend} />
        <RiskDistributionChart data={riskData} />
      </div>

      <RecentTransactions />
      <TopRiskyMerchantsChart />
      <RiskByCountryChart />
      <SystemHealthWidget />
      <MetricsPanel />

    </div>
  );
}

export default Dashboard;