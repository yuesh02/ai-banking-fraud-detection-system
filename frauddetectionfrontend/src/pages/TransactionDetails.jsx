import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getTransactionDetails
} from "../services/transactionService";

function TransactionDetails() {

  const { id } = useParams();

  const [transaction,
    setTransaction] = useState(null);

  useEffect(() => {

    const fetchDetails =
      async () => {

      try {

        const data =
          await getTransactionDetails(id);

        setTransaction(data);

      } catch (error) {

        console.error(error);

      }

    };

    fetchDetails();

  }, [id]);

  if (!transaction)
    return <div>Loading...</div>;

  return (

    <div>

      <h1 className="text-2xl font-bold mb-6">
        Transaction Details
      </h1>

      <div className="bg-white shadow rounded-xl p-6 space-y-3">

        <p>
          <b>Transaction ID:</b>
          {transaction.transactionId}
        </p>

        <p>
          <b>Customer ID:</b>
          {transaction.customerId}
        </p>

        <p>
          <b>Amount:</b>
          ₹ {transaction.amount}
        </p>

        <p>
          <b>Risk Score:</b>
          {transaction.riskScore}
        </p>

        <p>
          <b>Risk Level:</b>
          {transaction.riskLevel}
        </p>

        <p>
          <b>Fraud:</b>
          {transaction.fraud ? "Yes" : "No"}
        </p>

        <p>
          <b>Action:</b>
          {transaction.action}
        </p>

        <p>
          <b>Timestamp:</b>
          {new Date(
            transaction.timestamp
          ).toLocaleString()}
        </p>

      </div>

    </div>

  );

}

export default TransactionDetails;