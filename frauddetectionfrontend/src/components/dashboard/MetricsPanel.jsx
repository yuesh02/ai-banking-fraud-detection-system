import { useEffect, useState } from "react";

import {
  getMetrics
} from "../../services/metricsService";

function MetricsPanel() {

  const [metrics,
    setMetrics] = useState(null);

  const [seconds,
    setSeconds] = useState(20);

  /* Fetch metrics */

  useEffect(() => {

    fetchMetrics();

    const interval =
      setInterval(
        fetchMetrics,
        20000
      );

    return () =>
      clearInterval(interval);

  }, []);

  /* Countdown */

  useEffect(() => {

    const timer =
      setInterval(() => {

        setSeconds(prev =>
          prev === 0 ? 20 : prev - 1
        );

      }, 1000);

    return () =>
      clearInterval(timer);

  }, []);

  const fetchMetrics =
    async () => {

    try {

      const data =
        await getMetrics();

      setMetrics(data);

      setSeconds(20);

    } catch (error) {

      console.error(
        "Metrics fetch error:",
        error
      );

    }

  };

  if (!metrics)
    return null;

  return (

    <div className="bg-white shadow rounded-xl p-5 mt-6">

      <div className="flex justify-between mb-4">

        <h2 className="text-lg font-semibold">
          Model Metrics
        </h2>

        <div className="text-sm text-gray-500">

          Refreshing in

          <span className="font-bold ml-1">
            {seconds}s
          </span>

        </div>

      </div>

      {/* METRICS GRID */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <MetricCard
          title="Accuracy"
          value={`${metrics.accuracy.toFixed(2)}%`}
        />

        <MetricCard
          title="Precision"
          value={metrics.precision}
        />

        <MetricCard
          title="Recall"
          value={metrics.recall}
        />

      </div>

      {/* CONFUSION MATRIX */}

      <div className="mt-8">

        <h3 className="font-semibold mb-4">
          Confusion Matrix
        </h3>

        <div className="grid grid-cols-2 gap-4 max-w-sm">

          <MatrixBox
            label="True Positive"
            value={metrics.truePositive}
            color="bg-green-500"
          />

          <MatrixBox
            label="False Positive"
            value={metrics.falsePositive}
            color="bg-red-500"
          />

          <MatrixBox
            label="False Negative"
            value={metrics.falseNegative}
            color="bg-yellow-500"
          />

          <MatrixBox
            label="True Negative"
            value={metrics.trueNegative}
            color="bg-blue-500"
          />

        </div>

      </div>

    </div>

  );

}

/* -----------------------------
   Small components
----------------------------- */

function MetricCard({
  title,
  value
}) {

  return (

    <div className="bg-gray-50 p-4 rounded-lg">

      <div className="text-sm text-gray-500">
        {title}
      </div>

      <div className="text-xl font-bold">
        {value}
      </div>

    </div>

  );

}

function MatrixBox({
  label,
  value,
  color
}) {

  return (

    <div
      className={`${color} text-white p-4 rounded-lg`}
    >

      <div className="text-sm">
        {label}
      </div>

      <div className="text-xl font-bold">
        {value}
      </div>

    </div>

  );

}

export default MetricsPanel;