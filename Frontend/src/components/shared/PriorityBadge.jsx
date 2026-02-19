const priorityStyles = {
    LOW: "bg-slate-100 text-slate-600",
    MEDIUM: "bg-blue-100 text-blue-700",
    HIGH: "bg-orange-100 text-orange-700",
    CRITICAL: "bg-red-100 text-red-700",
};

const PriorityBadge = ({ priority }) => (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityStyles[priority] || "bg-gray-100 text-gray-500"}`}>
        {priority || "—"}
    </span>
);

export default PriorityBadge;
