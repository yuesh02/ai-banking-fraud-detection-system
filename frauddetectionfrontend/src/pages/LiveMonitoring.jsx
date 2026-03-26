/* eslint-disable react-hooks/immutability */
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

      {/* LIVE CARDS */}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[70vh] overflow-y-auto pr-1">

  {transactions.map((txn) => {

    const isHigh = txn.riskLevel === "HIGH";

    return (

      <div
        key={txn.transactionId}
        className={`
          bg-white border rounded-2xl p-5
          shadow-sm hover:shadow-md transition
          flex flex-col justify-between

          ${isHigh ? "border-red-300 ring-1 ring-red-200" : "border-gray-200"}
        `}
      >

        {/* TOP */}
        <div className="flex justify-between items-start">

          <div>
            <p className="text-sm font-semibold text-gray-800">
              #{txn.transactionId}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {txn.customerId}
            </p>
          </div>

          <RiskBadge level={txn.riskLevel} />

        </div>

        {/* AMOUNT */}
        <div className="mt-4">
          <p className="text-xs text-gray-500">Amount</p>
          <p className="text-xl font-bold text-indigo-600">
            ₹ {txn.amount?.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
        </div>

        {/* FRAUD STATUS */}
        <div className="mt-3">
          <span
            className={`
              text-xs px-2 py-1 rounded-full font-medium
              ${txn.fraud
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"}
            `}
          >
            {txn.fraud ? "Fraud" : "Safe"}
          </span>
        </div>

        {/* TIME */}
        <p className="text-xs text-gray-400 mt-3">
          {new Date(txn.timestamp).toLocaleString()}
        </p>

        {/* BUTTON */}
        <div className="mt-4 text-right">

          <button
            onClick={() => handleView(txn.transactionId)}
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