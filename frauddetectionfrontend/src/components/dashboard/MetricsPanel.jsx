/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import { getMetrics } from "../../services/metricsService";

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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mt-6">

      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">
          Model Metrics
        </h2>

        <span className="text-xs text-gray-400">
          {seconds}s refresh
        </span>
      </div>

      <div className="p-5">

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          <MetricCard
            title="Accuracy"
            value={`${metrics.accuracy.toFixed(2)}%`}
          />

          <MetricCard
            title="Precision"
            value={metrics.precision.toFixed(2)}
          />

          <MetricCard
            title="Recall"
            value={metrics.recall.toFixed(2)}
          />

        </div>

        {/* 🔥 FULL WIDTH CONFUSION MATRIX CARD */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">

          <h3 className="text-sm font-semibold text-gray-700 mb-5">
            Confusion Matrix
          </h3>

          {/* Matrix */}
          <div className="grid grid-cols-3 text-center">

            {/* Top Header */}
            <div></div>
            <div className="text-xl text-gray-500 font-medium">
              Predicted Fraud
            </div>
            <div className="text-xl text-gray-500 font-medium">
              Predicted Safe
            </div>

            {/* Row 1 */}
            <div className="text-xl text-gray-500 font-medium mt-4">
              Actual Fraud
            </div>

            <MatrixCell value={metrics.truePositive} type="good" />

            <MatrixCell value={metrics.falseNegative} type="warning" />

            {/* Row 2 */}
            <div className="text-xl text-gray-500 font-medium mt-4">
              Actual Safe
            </div>

            <MatrixCell value={metrics.falsePositive} type="bad" />

            <MatrixCell value={metrics.trueNegative} type="neutral" />

          </div>

        </div>

      </div>

    </div>
  );
}

/* -----------------------------
   Metric Card
----------------------------- */

function MetricCard({ title, value }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">

      <p className="text-xl text-gray-500">
        {title}
      </p>

      <p className="text-2xl font-semibold mt-1 text-gray-900">
        {value}
      </p>

    </div>
  );
}

/* -----------------------------
   Matrix Cell
----------------------------- */

function MatrixCell({ value, type }) {

  const styles = {
    good: "bg-green-600 text-white",
    bad: "bg-red-600 text-white",
    warning: "bg-amber-500 text-white",
    neutral: "bg-blue-600 text-white"
  };

  return (
    <div className={`mt-3 mx-2 p-4 rounded-xl shadow-sm ${styles[type]}`}>

      <p className="text-xl font-semibold">
        {value}
      </p>

    </div>
  );
}

export default MetricsPanel;