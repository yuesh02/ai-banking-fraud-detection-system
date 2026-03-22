import { useState } from "react";

import RiskBadge from "../common/RiskBadge";
import Modal from "../common/Modal";
import TransactionHistoryTimeline from
  "./TransactionHistoryTimeline";

import {
  getTransactionDetails
} from "../../services/transactionService";

function TransactionTable({ data }) {

  const [isOpen,
    setIsOpen] = useState(false);

  const [selectedTxn,
    setSelectedTxn] = useState(null);

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

      console.error(
        "Failed to fetch details:",
        error
      );

    }
  };
  const handleViewHistoryTxn =
  async (transactionId) => {

  try {

    const details =
      await getTransactionDetails(
        transactionId
      );

    setSelectedTxn(details);

  } catch (error) {

    console.error(error);

  }

};

  return (

    <div className="bg-white shadow rounded-xl p-5">

      <h2 className="text-lg font-semibold mb-4">
        Transactions
      </h2>

      <table className="w-full text-left">

        <thead>

          <tr className="border-b">

            <th>Transaction ID</th>
            <th>Customer</th>
            <th>Risk Score</th>
            <th>Risk Level</th>
            <th>Action</th>
            <th>Fraud</th>
            <th>Timestamp</th>
            <th>Details</th>

          </tr>

        </thead>

        <tbody>

          {data.map((txn) => (

            <tr
              key={txn.transactionId}
              className="border-b hover:bg-gray-50"
            >

              <td>{txn.transactionId}</td>

              <td>{txn.customerId}</td>

              <td>{txn.riskScore}</td>

              <td>
                <RiskBadge
                  level={txn.riskLevel}
                />
              </td>

              <td>{txn.action}</td>

              <td>
                {txn.fraud ? "Yes" : "No"}
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
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  View
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

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

            {/* DETAILS GRID */}

            <div className="grid grid-cols-2 gap-3">

              <p>
                <b>Transaction ID:</b>
                {selectedTxn.transactionId}
              </p>

              <p>
                <b>Customer ID:</b>
                {selectedTxn.customerId}
              </p>

              <p>
                <b>Amount:</b>
                ₹ {selectedTxn.amount?.toFixed(2)}
              </p>

              <p>
                <b>Merchant ID:</b>
                {selectedTxn.merchantId}
              </p>

              <p>
                <b>Merchant Country:</b>
                {selectedTxn.merchantCountry}
              </p>

              <p>
                <b>Device ID:</b>
                {selectedTxn.deviceId}
              </p>

              <p>
                <b>Risk Score:</b>
                {selectedTxn.riskScore}
              </p>

              <p>
                <b>Risk Level:</b>
                {selectedTxn.riskLevel}
              </p>

              <p>
                <b>Action:</b>
                {selectedTxn.action}
              </p>

              <p>
                <b>Fraud:</b>
                {selectedTxn.fraud ? "Yes" : "No"}
              </p>

              <p className="col-span-2">
                <b>Timestamp:</b>
                {new Date(
                  selectedTxn.timestamp
                ).toLocaleString()}
              </p>

            </div>

            {/* FRAUD REASON */}

            {selectedTxn.reason && (

              <div className="mt-4 bg-red-50 border border-red-200 p-3 rounded">

                <b>Fraud Reason:</b>

                <div className="mt-1">
                  {selectedTxn.reason}
                </div>

              </div>

            )}

            {/* HISTORY TIMELINE */}

            <TransactionHistoryTimeline
  history={selectedTxn.history}
  onViewHistoryTxn={
    handleViewHistoryTxn
  }
/>

          </div>

        )}

      </Modal>

    </div>

  );

}

export default TransactionTable;