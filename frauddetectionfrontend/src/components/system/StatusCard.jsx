function StatusCard({ title, status, value }) {
  const isUp = status === "UP" || status === "CONNECTED" || status === "RUNNING";

  return (
    <div className="glass-card p-5 border border-white/5 shadow-lg rounded-2xl flex flex-col justify-between">
      <h3 className="text-sm uppercase tracking-wider font-semibold text-gray-400 mb-4">
        {title}
      </h3>

      <div className="flex items-center justify-between mt-auto">
        <span
          className={`px-3 py-1 rounded-md text-xs font-bold border ${
            isUp
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : "bg-brand-accent/10 text-brand-accent border-brand-accent/20"
          }`}
        >
          {status}
        </span>

        {value && (
          <span className="text-gray-400 text-sm font-medium">
            {value}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatusCard;