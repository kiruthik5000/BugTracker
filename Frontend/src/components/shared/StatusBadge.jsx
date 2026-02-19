const statusColors = {
    OPEN: "border-sky-200 bg-sky-50 text-sky-700",
    IN_PROGRESS: "border-amber-200 bg-amber-50 text-amber-700",
    RESOLVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    CLOSED: "border-gray-200 bg-gray-100 text-gray-500",
    REOPENED: "border-rose-200 bg-rose-50 text-rose-700",
};

const statusDots = {
    OPEN: "bg-sky-400",
    IN_PROGRESS: "bg-amber-400",
    RESOLVED: "bg-emerald-400",
    CLOSED: "bg-gray-400",
    REOPENED: "bg-rose-400",
};

const StatusBadge = ({ status }) => {
    const color = statusColors[status] || "border-gray-200 bg-gray-100 text-gray-600";
    const dot = statusDots[status] || "bg-gray-400";
    const label = status?.replace("_", " ") || "Unknown";
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${color}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
            {label}
        </span>
    );
};

export default StatusBadge;
