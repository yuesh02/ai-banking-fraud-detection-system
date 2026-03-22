function StatusCard({
  title,
  status,
  value
}) {

  const isUp =
    status === "UP" ||
    status === "CONNECTED" ||
    status === "RUNNING";

  return (

    <div className="bg-white shadow rounded-xl p-5">

      <h3 className="text-lg font-semibold mb-2">
        {title}
      </h3>

      <div className="flex items-center justify-between">

        <span
          className={`
            px-3
            py-1
            rounded-full
            text-white
            text-sm
            ${
              isUp
                ? "bg-green-500"
                : "bg-red-500"
            }
          `}
        >
          {status}
        </span>

        {value && (

          <span className="text-gray-500 text-sm">
            {value}
          </span>

        )}

      </div>

    </div>

  );

}

export default StatusCard;