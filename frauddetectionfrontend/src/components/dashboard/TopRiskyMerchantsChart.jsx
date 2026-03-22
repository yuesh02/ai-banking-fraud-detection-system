import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import {
  getTopRiskyMerchants
} from "../../services/merchantService";

function TopRiskyMerchantsChart() {

  const [data,
    setData] = useState([]);

  const [seconds,
    setSeconds] = useState(15);

  /* Fetch merchants */

  useEffect(() => {

    fetchMerchants();

    const interval =
      setInterval(
        fetchMerchants,
        15000
      );

    return () =>
      clearInterval(interval);

  }, []);

  /* Countdown */

  useEffect(() => {

    const timer =
      setInterval(() => {

        setSeconds(prev =>
          prev === 0 ? 15 : prev - 1
        );

      }, 1000);

    return () =>
      clearInterval(timer);

  }, []);

  const fetchMerchants =
    async () => {

    try {

      const result =
        await getTopRiskyMerchants();

      setData(result);

      setSeconds(15);

    } catch (error) {

      console.error(
        "Merchant fetch error:",
        error
      );

    }

  };

  return (

    <div className="bg-white shadow rounded-xl p-5 mt-6">

      <div className="flex justify-between mb-4">

        <h2 className="text-lg font-semibold">

          Top Risky Merchants

        </h2>

        <div className="text-sm text-gray-500">

          Refreshing in

          <span className="font-bold ml-1">

            {seconds}s

          </span>

        </div>

      </div>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <BarChart data={data}>

          <XAxis
            dataKey="merchantId"
          />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="fraudCount"
            radius={[6, 6, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

}

export default TopRiskyMerchantsChart;