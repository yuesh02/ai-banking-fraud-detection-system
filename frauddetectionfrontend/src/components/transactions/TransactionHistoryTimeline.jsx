import { getTransactionDetails } from
  "../../services/transactionService";

function TransactionHistoryTimeline({
  history,
  onViewHistoryTxn
}) {

  if (!history || history.length === 0) {

    return (
      <p className="text-gray-500 mt-4">
        No history available
      </p>
    );

  }

  return (

    <div className="mt-6">

      <h3 className="text-lg font-semibold mb-3">
        Customer Transaction History
      </h3>

      <div className="border-l-2 border-gray-300 ml-3">

        {history.map(
          (item, index) => (

          <div
            key={index}
            className="mb-6 ml-4 relative"
          >

            {/* Timeline dot */}

            <div
              className="absolute -left-2 top-1 w-3 h-3 bg-blue-600 rounded-full"
            />

            <p className="font-semibold">

              ₹ {item.amount?.toFixed(2)}

              {" — "}

              {item.merchantId}

            </p>

            <p className="text-sm text-gray-500">

              {new Date(
                item.timestamp
              ).toLocaleString()}

            </p>

            {/* VIEW BUTTON */}

            <button
              onClick={() =>
                onViewHistoryTxn(
                  item.transactionId
                )
              }
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
            >
              View
            </button>

          </div>

        ))}

      </div>

    </div>

  );

}

export default TransactionHistoryTimeline;