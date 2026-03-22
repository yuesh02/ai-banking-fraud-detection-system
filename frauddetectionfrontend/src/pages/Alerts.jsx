import { useEffect, useState } from "react";

import { getAlerts } from
  "../services/alertService";

import AlertBadge from
  "../components/common/AlertBadge";

import Modal from
  "../components/common/Modal";

import {
  getTransactionDetails
} from "../services/transactionService";

function Alerts() {

  const [alerts,
    setAlerts] = useState([]);

  const [alertCount,
    setAlertCount] = useState(0);

  const [previousIds,
    setPreviousIds] = useState([]);

  const [seconds,
    setSeconds] = useState(5);

  const [isOpen,
    setIsOpen] = useState(false);

  const [selectedTxn,
    setSelectedTxn] = useState(null);

  /* -----------------------------
     Fetch alerts every 5 seconds
  ----------------------------- */

  useEffect(() => {

    fetchAlerts();

    const interval =
      setInterval(
        fetchAlerts,
        5000
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
          prev === 0 ? 5 : prev - 1
        );

      }, 1000);

    return () =>
      clearInterval(timer);

  }, []);

  /* -----------------------------
     Publish alert count globally
  ----------------------------- */

  useEffect(() => {

    window.alertCount =
      alertCount;

  }, [alertCount]);

  /* -----------------------------
     Fetch alerts logic
  ----------------------------- */

  const fetchAlerts =
    async () => {

    try {

      const data =
        await getAlerts();

      setAlertCount(
        data.totalElements
      );

      const newIds =
        data.map(
          a => a.transactionId
        );

      setPreviousIds(prev => {

        const newAlerts =
          newIds.filter(
            id =>
              !prev.includes(id)
          );

        if (
          newAlerts.length > 0
        ) {

          console.log(
            "New alerts detected:",
            newAlerts
          );

        }

        return newIds;

      });

      setAlerts(data);

      setSeconds(5);

    } catch (error) {

      console.error(error);

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
          Alerts (Real-Time)
        </h1>

        <div className="text-sm text-gray-500">

          Refreshing in

          <span className="font-bold ml-1">
            {seconds}s
          </span>

        </div>

      </div>

      {/* TABLE */}

      <div className="bg-white shadow rounded-xl p-5">

        <table className="w-full text-left">

          <thead>

            <tr className="border-b">

              <th>Transaction ID</th>
              <th>Customer</th>
              <th>Risk Level</th>
              <th>Action</th>
              <th>Timestamp</th>
              <th>Details</th>

            </tr>

          </thead>

          <tbody>

            {alerts.map((alert) => {

              const isNew =
                !previousIds.includes(
                  alert.transactionId
                );

              const isHigh =
                alert.riskLevel === "HIGH";

              return (

                <tr
                  key={
                    alert.transactionId
                  }
                  className={`
                    border-b
                    hover:bg-gray-50
                    transition

                    ${
                      isNew
                        ? "bg-green-50"
                        : ""
                    }

                    ${
                      isHigh
                        ? "animate-pulse bg-red-50"
                        : ""
                    }
                  `}
                >

                  <td>
                    {alert.transactionId}
                  </td>

                  <td>
                    {alert.customerId}
                  </td>

                  <td>

                    <AlertBadge
                      level={
                        alert.riskLevel
                      }
                    />

                  </td>

                  <td>
                    {alert.action}
                  </td>

                  <td>

                    {new Date(
                      alert.timestamp
                    ).toLocaleString()}

                  </td>

                  <td>

                    <button
                      onClick={() =>
                        handleView(
                          alert.transactionId
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

export default Alerts;