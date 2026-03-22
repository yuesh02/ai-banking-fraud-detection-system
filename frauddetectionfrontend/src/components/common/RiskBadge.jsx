function RiskBadge({ level }) {

  let color = "bg-gray-400";

  if (level === "LOW")
    color = "bg-green-500";

  if (level === "MEDIUM")
    color = "bg-yellow-500";

  if (level === "HIGH")
    color = "bg-red-500";

  return (
    <span
      className={`text-white px-2 py-1 rounded text-xs ${color}`}
    >
      {level}
    </span>
  );

}

export default RiskBadge;