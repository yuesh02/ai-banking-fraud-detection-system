import { useEffect, useState } from "react";

import KPIcard from "../components/dashboard/KPIcard";
import FraudTrendChart from "../components/dashboard/FraudTrendChart";
import RiskDistributionChart from
  "../components/dashboard/RiskDistributionChart";
import SystemHealthWidget from
  "../components/dashboard/SystemHealthWidget";
import TopRiskyMerchantsChart
from "../components/dashboard/TopRiskyMerchantsChart";
import RiskByCountryChart
from "../components/dashboard/RiskByCountryChart";
import MetricsPanel
from "../components/dashboard/MetricsPanel";
import RecentTransactions
from "../components/dashboard/RecentTransactions";
import {
  getSummary,
  getFraudTrend,
  getRiskDistribution
} from "../services/dashboardService";
function Dashboard() {

  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [riskData, setRiskData] = useState([]);
  useEffect(() => {

    const fetchData = async () => {
      try {
        const riskDist =
  await getRiskDistribution();

        const summaryData =
          await getSummary();

        const trendData =
          await getFraudTrend();

        console.log("Summary:", summaryData);
        console.log("Trend:", trendData);

        setSummary(summaryData);
        setTrend(trendData);
        setRiskData(riskDist);

      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    fetchData();

  }, []);

  if (!summary)
    return (
      <div className="p-6">
        Loading dashboard...
      </div>
    );

  return (

    <div>

      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      {/* KPI CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">

        <KPIcard
          title="Total Transactions"
          value={summary.totalTransactions}
        />

        <KPIcard
          title="Total Frauds"
          value={summary.totalFrauds}
        />

        <KPIcard
          title="Fraud Rate"
          value={`${summary.fraudRate}%`}
        />

        <KPIcard
          title="Total Amount"
          value={`₹ ${summary.totalAmount}`}
        />

        <KPIcard
          title="Average Risk Score"
          value={summary.averageRiskScore}
        />

      </div>

      {/* FRAUD TREND CHART */}

     <div className="mt-8 grid md:grid-cols-2 gap-6">

  <FraudTrendChart
    data={trend}
  />

  <RiskDistributionChart
    data={riskData}
  />

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