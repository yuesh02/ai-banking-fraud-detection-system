import { ArrowUpRight, AlertTriangle, CheckCircle } from "lucide-react";

function TransactionHistoryTimeline({
  history,
  onViewHistoryTxn
}) {

  if (!history || history.length === 0) {
    return (
      <p className="text-gray-500 mt-4 text-sm">
        No history available
      </p>
    );
  }

  return (

    <div className="mt-6">

      {/* Header */}
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Customer Transaction History
      </h3>

      <div className="relative border-l border-gray-200 ml-4">

        {history.map((item, index) => {

          const isFraud = item.fraud;
          const isLatest = index === 0;

          return (
            <div
              key={index}
              className={`
                ml-6 mb-6 relative
                animate-slideIn
              `}
            >

              {/* 🔵 Timeline Dot */}
              <div
                className={`
                  absolute -left-2.75 top-2
                  w-3 h-3 rounded-full
                  ${isFraud ? "bg-red-500" : "bg-indigo-500"}
                `}
              />

              {/* 🔥 Card */}
              <div className={`
                rounded-xl p-4 border
                transition
                ${isLatest
                  ? "bg-indigo-50 border-indigo-200 shadow-md"
                  : "bg-white border-gray-200 hover:shadow-md"
                }
              `}>

                {/* Top Row */}
                <div className="flex justify-between items-center">

                  {/* Amount + Icon */}
                  <div className="flex items-center gap-2">

                    <div className={`
                      p-2 rounded-lg
                      ${isFraud
                        ? "bg-red-100 text-red-600"
                        : "bg-indigo-100 text-indigo-600"}
                    `}>
                      {isFraud
                        ? <AlertTriangle size={16} />
                        : <ArrowUpRight size={16} />
                      }
                    </div>

                    <p className="font-semibold text-gray-800">
                      ₹ {item.amount?.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>

                  </div>

                  {/* Status */}
                  <span
                    className={`
                      text-xs px-2 py-1 rounded-full font-medium
                      ${isFraud
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"}
                    `}
                  >
                    {isFraud ? "Fraud" : "Safe"}
                  </span>

                </div>

                {/* Merchant */}
                <p className="text-sm text-gray-600 mt-2">
                  {item.merchantId}
                </p>

                {/* Time */}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.timestamp).toLocaleString()}
                </p>

                {/* Latest Badge */}
                {isLatest && (
                  <span className="inline-block mt-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded">
                    Latest
                  </span>
                )}

                {/* Button */}
                <div className="mt-3 text-right">

                  <button
                    onClick={() =>
                      onViewHistoryTxn(item.transactionId)
                    }
                    className="
                      text-xs px-3 py-1.5
                      bg-indigo-600 text-white
                      rounded-lg
                      hover:bg-indigo-700
                      transition
                    "
                  >
                    View Details
                  </button>

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>

  );
}

export default TransactionHistoryTimeline;