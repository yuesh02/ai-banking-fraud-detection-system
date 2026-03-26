/* eslint-disable react-hooks/immutability */
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

        {/* ALERT CARD BOXES */}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

  {alerts.map((alert) => {

    const isNew = !previousIds.includes(alert.transactionId);
    const isHigh = alert.riskLevel === "HIGH";

    return (

      <div
        key={alert.transactionId}
        className={`
          relative
          bg-white
          border rounded-2xl p-5
          shadow-sm hover:shadow-md transition

          ${isNew ? "border-green-300 bg-green-50" : "border-gray-200"}
          ${isHigh ? "ring-2 ring-red-300" : ""}
        `}
      >

        {/* TOP SECTION */}
        <div className="flex justify-between items-start">

          <div>
            <p className="text-sm font-semibold text-gray-800">
              #{alert.transactionId}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {alert.customerId}
            </p>
          </div>

          <AlertBadge level={alert.riskLevel} />

        </div>

        {/* ACTION */}
        <p className="text-sm text-gray-600 mt-3">
          {alert.action}
        </p>

        {/* TIME */}
        <p className="text-xs text-gray-400 mt-2">
          {new Date(alert.timestamp).toLocaleString()}
        </p>

        {/* TAGS */}
        <div className="flex gap-2 mt-3">

          {isNew && (
            <span className="text-[10px] bg-green-200 text-green-700 px-2 py-0.5 rounded-full">
              New
            </span>
          )}

          {isHigh && (
            <span className="text-[10px] bg-red-200 text-red-700 px-2 py-0.5 rounded-full">
              High Risk
            </span>
          )}

        </div>

        {/* BUTTON */}
        <div className="mt-4 text-right">

          <button
            onClick={() => handleView(alert.transactionId)}
            className="
              px-3 py-1.5 text-xs font-medium
              bg-indigo-600 text-white rounded-lg
              hover:bg-indigo-700 transition
            "
          >
            View Details
          </button>

        </div>

      </div>

    );

  })}

</div>

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