import { useEffect, useState } from "react";

import {
  getLiveTransactions
} from "../services/liveService";

import {
  getTransactionDetails
} from "../services/transactionService";

import RiskBadge from
  "../components/common/RiskBadge";

import Modal from
  "../components/common/Modal";

function LiveMonitoring() {

  const [transactions,
    setTransactions] = useState([]);

  const [seconds,
    setSeconds] = useState(3);

  const [isOpen,
    setIsOpen] = useState(false);

  const [selectedTxn,
    setSelectedTxn] = useState(null);

  /* -----------------------------
     Fetch live transactions
  ----------------------------- */

  useEffect(() => {

    fetchLive();

    const interval =
      setInterval(
        fetchLive,
        3000
      );

    return () =>
      clearInterval(interval);

  }, []);

  /* -----------------------------
     Countdown timer
  ----------------------------- */

  useEffect(() => {

    const timer =
      setInterval(() => {

        setSeconds(prev =>
          prev === 0 ? 3 : prev - 1
        );

      }, 1000);

    return () =>
      clearInterval(timer);

  }, []);

  const fetchLive =
    async () => {

    try {

      const data =
        await getLiveTransactions();

      setTransactions(data);

      setSeconds(3);

    } catch (error) {

      console.error(
        "Live fetch error:",
        error
      );

    }

  };

  /* -----------------------------
     View transaction details
  ----------------------------- */

  const handleView =
    async (transactionId) => {

    try {

      const details =
        await getTransactionDetails(
          transactionId
        );

      setSelectedTxn(details);

      setIsOpen(true);

    } catch (error) {

      console.error(error);

    }

  };

  return (

    <div>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          Live Monitoring
        </h1>

        <div className="text-sm text-gray-500">

          Refreshing in

          <span className="font-bold ml-1">
            {seconds}s
          </span>

        </div>

      </div>

      {/* LIVE TABLE */}

      <div className="bg-white shadow rounded-xl p-5 max-h-[70vh] overflow-y-auto">

        <table className="w-full text-left">

          <thead>

            <tr className="border-b">

              <th>Transaction ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Risk Level</th>
              <th>Fraud</th>
              <th>Timestamp</th>
              <th>Details</th>

            </tr>

          </thead>

          <tbody>

            {transactions.map((txn) => {

              const isHigh =
                txn.riskLevel === "HIGH";

              return (

                <tr
                  key={txn.transactionId}
                  className={`
                    border-b
                    hover:bg-gray-50
                    transition

                    ${
                      isHigh
                        ? "bg-red-50 animate-pulse"
                        : ""
                    }
                  `}
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
                      level={
                        txn.riskLevel
                      }
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

                  <td>

                    <button
                      onClick={() =>
                        handleView(
                          txn.transactionId
                        )
                      }
                      className="
                        bg-blue-600
                        text-white
                        px-3
                        py-1
                        rounded
                        hover:bg-blue-700
                      "
                    >
                      View
                    </button>

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

      {/* MODAL */}

      <Modal
        isOpen={isOpen}
        onClose={() =>
          setIsOpen(false)
        }
      >

        {selectedTxn && (

          <div>

            <h2 className="text-xl font-bold mb-4">
              Transaction Details
            </h2>

            <div className="grid grid-cols-2 gap-3">

              <p>
                <b>ID:</b>
                {selectedTxn.transactionId}
              </p>

              <p>
                <b>Customer:</b>
                {selectedTxn.customerId}
              </p>

              <p>
                <b>Amount:</b>
                ₹ {selectedTxn.amount}
              </p>

              <p>
                <b>Merchant:</b>
                {selectedTxn.merchantId}
              </p>

              <p>
                <b>Country:</b>
                {selectedTxn.merchantCountry}
              </p>

              <p>
                <b>Device:</b>
                {selectedTxn.deviceId}
              </p>

              <p>
                <b>Risk Level:</b>
                {selectedTxn.riskLevel}
              </p>

              <p>
                <b>Action:</b>
                {selectedTxn.action}
              </p>

            </div>

            {selectedTxn.reason && (

              <div className="mt-4 bg-red-50 border border-red-200 p-3 rounded">

                <b>Fraud Reason:</b>

                <div>
                  {selectedTxn.reason}
                </div>

              </div>

            )}

          </div>

        )}

      </Modal>

    </div>

  );

}

export default LiveMonitoring;