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
  getRiskByCountry
} from "../../services/countryService";

function RiskByCountryChart() {

  const [data,
    setData] = useState([]);

  const [seconds,
    setSeconds] = useState(15);

  /* Fetch country risk */

  useEffect(() => {

    fetchCountries();

    const interval =
      setInterval(
        fetchCountries,
        15000
      );

    return () =>
      clearInterval(interval);

  }, []);

  /* Countdown timer */

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

  const fetchCountries =
    async () => {

    try {

      const result =
        await getRiskByCountry();

      setData(result);

      setSeconds(15);

    } catch (error) {

      console.error(
        "Country fetch error:",
        error
      );

    }

  };

  return (

    <div className="bg-white shadow rounded-xl p-5 mt-6">

      <div className="flex justify-between mb-4">

        <h2 className="text-lg font-semibold">

          Risk by Country

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

          <XAxis dataKey="country" />

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

export default RiskByCountryChart;