const statusStyles = {
    OPEN: "bg-sky-100 text-sky-700",
    IN_PROGRESS: "bg-amber-100 text-amber-700",
    RESOLVED: "bg-emerald-100 text-emerald-700",
    CLOSED: "bg-gray-200 text-gray-600",
    REOPENED: "bg-rose-100 text-rose-700",
};

const StatusBadge = ({ status }) => {
    const label = status?.replace("_", " ") || "Unknown";
    return (
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status] || "bg-gray-100 text-gray-500"}`}>
            {label}
        </span>
    );
};

export default StatusBadge;
