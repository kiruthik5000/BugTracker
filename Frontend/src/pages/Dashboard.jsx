import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getAllBugs, getCreatedBugs, getAssignedBugs } from "../services/bugService";
import StatusBadge from "../components/shared/StatusBadge";
import PriorityBadge from "../components/shared/PriorityBadge";
import { useNavigate } from "react-router-dom";

const statConfig = [
    { key: "total", status: "ALL", label: "Total Bugs", color: "from-gray-500 to-gray-700", textColor: "text-gray-700" },
    { key: "open", status: "OPEN", label: "Open", color: "from-sky-400 to-sky-600", textColor: "text-sky-700" },
    { key: "inProgress", status: "IN_PROGRESS", label: "In Progress", color: "from-amber-400 to-amber-600", textColor: "text-amber-700" },
    { key: "resolved", status: "RESOLVED", label: "Resolved", color: "from-emerald-400 to-emerald-600", textColor: "text-emerald-700" },
];

const priorityFilters = [
    { value: "ALL", label: "All Priorities", style: "border-gray-200 bg-white text-gray-600" },
    { value: "CRITICAL", label: "Critical", style: "border-red-200 bg-red-50 text-red-700" },
    { value: "HIGH", label: "High", style: "border-orange-200 bg-orange-50 text-orange-700" },
    { value: "MEDIUM", label: "Medium", style: "border-blue-200 bg-blue-50 text-blue-700" },
    { value: "LOW", label: "Low", style: "border-slate-200 bg-slate-50 text-slate-600" },
];

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bugs, setBugs] = useState([]);
    const [myBugs, setMyBugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [priorityFilter, setPriorityFilter] = useState("ALL");

    useEffect(() => {
        const load = async () => {
            try {
                const allRes = await getAllBugs();
                setBugs(allRes.data);

                if (user?.id) {
                    if (user.role === "TESTER") {
                        const res = await getCreatedBugs(user.id);
                        setMyBugs(res.data);
                    } else if (user.role === "DEVELOPER") {
                        const res = await getAssignedBugs(user.id);
                        setMyBugs(res.data);
                    }
                }
            } catch (err) {
                console.error("Failed to load dashboard", err);
            }
            setLoading(false);
        };
        load();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" />
            </div>
        );
    }

    const counts = {
        total: bugs.length,
        open: bugs.filter((b) => b.status === "OPEN").length,
        inProgress: bugs.filter((b) => b.status === "IN_PROGRESS").length,
        resolved: bugs.filter((b) => b.status === "RESOLVED").length,
        closed: bugs.filter((b) => b.status === "CLOSED").length,
    };

    const hasActiveFilter = statusFilter !== "ALL" || priorityFilter !== "ALL";

    const applyFilters = (list) =>
        list.filter(
            (b) =>
                (statusFilter === "ALL" || b.status === statusFilter) &&
                (priorityFilter === "ALL" || b.priority === priorityFilter)
        );

    const filteredMyBugs = applyFilters(myBugs);
    const filteredRecentBugs = hasActiveFilter ? applyFilters(bugs) : bugs.slice(0, 8);

    const toggleStatusFilter = (status) => {
        setStatusFilter((prev) => (prev === status ? "ALL" : status));
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    <p className="mt-0.5 text-sm text-gray-400">Click any stat card or priority pill to filter bugs</p>
                </div>
                {user?.role === "TESTER" && (
                    <button
                        type="button"
                        onClick={() => navigate("/bugs/new")}
                        className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                        + Report Bug
                    </button>
                )}
            </div>

            {/* Stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statConfig.map((s) => {
                    const isActive = statusFilter === s.status && (s.status !== "ALL" || hasActiveFilter === false);
                    return (
                        <button
                            key={s.key}
                            type="button"
                            onClick={() => (s.status === "ALL" ? setStatusFilter("ALL") : toggleStatusFilter(s.status))}
                            className={`relative overflow-hidden rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:shadow-md ${
                                isActive && s.status !== "ALL"
                                    ? "border-blue-500 ring-2 ring-blue-100"
                                    : "border-gray-100"
                            }`}
                        >
                            <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${s.color}`} />
                            <p className="pl-3 text-sm font-medium text-gray-500">{s.label}</p>
                            <p className={`mt-1 pl-3 text-3xl font-extrabold ${s.textColor}`}>{counts[s.key]}</p>
                        </button>
                    );
                })}
            </div>

            {/* Priority filter pills */}
            <div className="flex flex-wrap items-center gap-2">
                {priorityFilters.map((p) => {
                    const count = p.value === "ALL" ? bugs.length : bugs.filter((b) => b.priority === p.value).length;
                    const active = priorityFilter === p.value;
                    return (
                        <button
                            key={p.value}
                            type="button"
                            onClick={() => setPriorityFilter((prev) => (prev === p.value && p.value !== "ALL" ? "ALL" : p.value))}
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition ${p.style} ${
                                active ? "ring-2 ring-blue-500 ring-offset-1" : "opacity-75 hover:opacity-100"
                            }`}
                        >
                            <span>{p.label}</span>
                            <span className="rounded-full bg-white/70 px-1.5 py-0.5 text-[11px]">{count}</span>
                        </button>
                    );
                })}
                {hasActiveFilter && (
                    <button
                        type="button"
                        onClick={() => {
                            setStatusFilter("ALL");
                            setPriorityFilter("ALL");
                        }}
                        className="ml-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {/* Role-specific section */}
            {user?.role === "TESTER" && (
                <Section
                    title="My Reported Bugs"
                    bugs={filteredMyBugs}
                    navigate={navigate}
                    emptyMsg={hasActiveFilter ? "No reported bugs match the selected filters." : "You haven't reported any bugs yet."}
                />
            )}
            {user?.role === "DEVELOPER" && (
                <Section
                    title="Assigned to Me"
                    bugs={filteredMyBugs}
                    navigate={navigate}
                    emptyMsg={hasActiveFilter ? "No assigned bugs match the selected filters." : "No bugs assigned to you."}
                />
            )}
            {(user?.role === "PROJECT_MANAGER" || user?.role === "ADMIN") && (
                <div className="space-y-5">
                    <h2 className="text-lg font-bold text-gray-800">Status Breakdown</h2>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <MiniStat label="Open" count={counts.open} color="border-sky-200 bg-sky-50 text-sky-700" />
                        <MiniStat label="In Progress" count={counts.inProgress} color="border-amber-200 bg-amber-50 text-amber-700" />
                        <MiniStat label="Resolved" count={counts.resolved} color="border-emerald-200 bg-emerald-50 text-emerald-700" />
                        <MiniStat label="Closed" count={counts.closed} color="border-gray-200 bg-gray-50 text-gray-600" />
                    </div>
                    <Section
                        title={hasActiveFilter ? "Filtered Bugs" : "Recent Bugs"}
                        bugs={filteredRecentBugs}
                        navigate={navigate}
                        emptyMsg={hasActiveFilter ? "No bugs match the selected filters." : "No bugs found."}
                    />
                </div>
            )}
        </div>
    );
};

const MiniStat = ({ label, count, color }) => (
    <div className={`rounded-xl border px-4 py-3 ${color}`}>
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
        <p className="mt-0.5 text-2xl font-extrabold">{count}</p>
    </div>
);

const Section = ({ title, bugs, navigate, emptyMsg }) => (
    <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        {bugs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-10 text-center">
                <p className="text-3xl">🐛</p>
                <p className="mt-2 text-sm text-gray-400">{emptyMsg}</p>
            </div>
        ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-100 bg-gray-50/60">
                        <tr>
                            <th className="px-4 py-3 font-semibold text-gray-500">Title</th>
                            <th className="px-4 py-3 font-semibold text-gray-500">Status</th>
                            <th className="px-4 py-3 font-semibold text-gray-500">Priority</th>
                            <th className="px-4 py-3 font-semibold text-gray-500">Created</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {bugs.map((b) => (
                            <tr
                                key={b.id}
                                className="cursor-pointer transition-colors hover:bg-blue-50/40"
                                onClick={() => navigate(`/bugs/${b.id}`)}
                            >
                                <td className="px-4 py-3 font-medium text-gray-800">{b.title}</td>
                                <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                                <td className="px-4 py-3"><PriorityBadge priority={b.priority} /></td>
                                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(b.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

export default Dashboard;
