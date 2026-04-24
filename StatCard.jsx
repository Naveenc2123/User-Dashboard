/**
 * StatCard
 *
 * Summary metric card used on the Dashboard.
 *
 * Props:
 *  label    – string description (e.g. "Total Users")
 *  value    – number or string to display prominently
 *  icon     – ReactNode (optional) shown top-right
 *  color    – "indigo" | "green" | "red" | "yellow"  (default: "indigo")
 *
 * Usage:
 *   <StatCard label="Total Users"  value={totalUsers}  color="indigo" />
 *   <StatCard label="Active Users" value={activeUsers} color="green"  />
 *   <StatCard label="Average Age"  value={avgAge}      color="yellow" />
 */

const COLORS = {
  indigo: { icon: "bg-indigo-100 text-indigo-600", value: "text-indigo-700" },
  green:  { icon: "bg-green-100  text-green-600",  value: "text-green-700"  },
  red:    { icon: "bg-red-100    text-red-500",     value: "text-red-600"    },
  yellow: { icon: "bg-yellow-100 text-yellow-600",  value: "text-yellow-700" },
};

const StatCard = ({
  label,
  value,
  icon = null,
  color = "indigo",
  className = "",
}) => {
  const palette = COLORS[color] ?? COLORS.indigo;

  return (
    <div
      className={[
        "bg-white rounded-xl shadow p-5 flex items-center justify-between gap-4",
        className,
      ].join(" ")}
    >
      <div>
        <p className="text-gray-500 text-sm mb-1">{label}</p>
        <p className={`text-2xl font-bold ${palette.value}`}>{value}</p>
      </div>

      {icon && (
        <div
          className={[
            "w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0",
            palette.icon,
          ].join(" ")}
        >
          {icon}
        </div>
      )}
    </div>
  );
};

export default StatCard;
