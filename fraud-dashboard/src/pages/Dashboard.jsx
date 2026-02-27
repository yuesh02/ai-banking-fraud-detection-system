import React from "react";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import RiskChart from "../components/RiskChart";
import PieChartCard from "../components/PieChartCard";
import TransactionsTable from "../components/TransactionsTable";
import {
  getSummary,
  getRiskTrend,
  getFraudDistribution,
  getTransactions
} from "../services/api";

export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const [trend, setTrend] = useState([]);
  const [distribution, setDistribution] = useState({});
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getSummary().then(res => setSummary(res.data));
    getRiskTrend().then(res => setTrend(res.data));
    getFraudDistribution().then(res => setDistribution(res.data));
    getTransactions().then(res => setTransactions(res.data));
  }, []);

  return (
    <Layout>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Transactions" value={summary.totalTransactions} />
        <StatCard title="Total Fraud" value={summary.totalFraud} danger />
        <StatCard title="Fraud Rate %" value={summary.fraudRate} />
        <StatCard title="Avg Risk Score" value={summary.averageRisk} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <RiskChart data={trend} />
        <PieChartCard
          fraud={distribution.fraud}
          normal={distribution.normal}
        />
      </div>

      {/* Table */}
      <TransactionsTable transactions={transactions} />

    </Layout>
  );
}