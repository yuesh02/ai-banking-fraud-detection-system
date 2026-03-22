import { useEffect, useState } from "react";

import {
  getRecentTransactions
} from "../../services/recentService";

import RiskBadge from
  "../common/RiskBadge";

function RecentTransactions() {

  const [transactions,
    setTransactions] = useState([]);

  const [seconds,
    setSeconds] = useState(10);

  /* Fetch transactions */

  useEffect(() => {

    fetchRecent();

    const interval =
      setInterval(
        fetchRecent,
        10000
      );

    return () =>
      clearInterval(interval);

  }, []);

  /* Countdown */

  useEffect(() => {

    const timer =
      setInterval(() => {

        setSeconds(prev =>
          prev === 0 ? 10 : prev - 1
        );

      }, 1000);

    return () =>
      clearInterval(timer);

  }, []);

  const fetchRecent =
    async () => {

    try {

      const data =
        await getRecentTransactions();

      setTransactions(
  data.filter(txn => txn != null)
);

      setSeconds(10);

    } catch (error) {

      console.error(
        "Recent fetch error:",
        error
      );

    }

  };

  return (

    <div className="bg-white shadow rounded-xl p-5 mt-6">

      <div className="flex justify-between mb-4">

        <h2 className="text-lg font-semibold">
          Recent Transactions
        </h2>

        <div className="text-sm text-gray-500">

          Refreshing in

          <span className="font-bold ml-1">
            {seconds}s
          </span>

        </div>

      </div>

      <table className="w-full text-left">

        <thead>

          <tr className="border-b">

            <th>Transaction ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Risk</th>
            <th>Fraud</th>
            <th>Time</th>

          </tr>

        </thead>

        <tbody>

          {transactions.map((txn) => (

            <tr
              key={txn.transactionId}
              className="border-b hover:bg-gray-50"
            >

              <td>
                {txn.transactionId}
              </td>

              <td>
                {txn.customerId}
              </td>

              <td>
                ₹ {txn.amount}
              </td>

              <td>

                <RiskBadge
                  level={txn.riskLevel}
                />

              </td>

              <td>

                {txn.fraud
                  ? "Yes"
                  : "No"}

              </td>

              <td>

                {new Date(
                  txn.timestamp
                ).toLocaleString()}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default RecentTransactions;