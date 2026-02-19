const priorityColors = {
    LOW: "border-slate-200 bg-slate-50 text-slate-600",
    MEDIUM: "border-blue-200 bg-blue-50 text-blue-700",
    HIGH: "border-orange-200 bg-orange-50 text-orange-700",
    CRITICAL: "border-red-200 bg-red-50 text-red-700",
};

const priorityIcons = {
    LOW: "↓",
    MEDIUM: "→",
    HIGH: "↑",
    CRITICAL: "⚠",
};

const PriorityBadge = ({ priority }) => {
    const color = priorityColors[priority] || "border-gray-200 bg-gray-100 text-gray-600";
    const icon = priorityIcons[priority] || "•";
    return (
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${color}`}>
            <span className="text-[10px]">{icon}</span>
            {priority}
        </span>
    );
};

export default PriorityBadge;
