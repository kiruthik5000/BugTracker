import { useEffect, useState } from "react";
import { getAllBugs } from "../services/bugService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import StatusBadge from "../components/shared/StatusBadge";
import PriorityBadge from "../components/shared/PriorityBadge";
import Dropdown from "../components/shared/Dropdown";

const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "OPEN", label: "Open", color: "bg-sky-400" },
    { value: "IN_PROGRESS", label: "In Progress", color: "bg-amber-400" },
    { value: "RESOLVED", label: "Resolved", color: "bg-emerald-400" },
    { value: "CLOSED", label: "Closed", color: "bg-gray-400" },
    { value: "REOPENED", label: "Reopened", color: "bg-rose-400" },
];

const priorityOptions = [
    { value: "", label: "All Priorities" },
    { value: "LOW", label: "Low", color: "bg-slate-400" },
    { value: "MEDIUM", label: "Medium", color: "bg-blue-400" },
    { value: "HIGH", label: "High", color: "bg-orange-400" },
    { value: "CRITICAL", label: "Critical", color: "bg-red-500" },
];

const BugsList = () => {
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        getAllBugs()
            .then((res) => setBugs(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = bugs.filter((b) => {
        const matchSearch = b.title.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter ? b.status === statusFilter : true;
        const matchPriority = priorityFilter ? b.priority === priorityFilter : true;
        return matchSearch && matchStatus && matchPriority;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">All Bugs</h1>
                    <p className="mt-1 text-sm text-gray-400">{bugs.length} bugs total · {filtered.length} shown</p>
                </div>
                {user?.role === "TESTER" && (
                    <button
                        onClick={() => navigate("/bugs/new")}
                        className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                        + Report Bug
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[220px] max-w-sm">
                    <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                </div>
                <Dropdown
                    options={statusOptions}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    placeholder="All Statuses"
                    className="w-44"
                />
                <Dropdown
                    options={priorityOptions}
                    value={priorityFilter}
                    onChange={setPriorityFilter}
                    placeholder="All Priorities"
                    className="w-44"
                />
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-12 text-center">
                    <p className="text-3xl">🔍</p>
                    <p className="mt-2 text-sm text-gray-400">No bugs match your filters.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/60">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-gray-500">Title</th>
                                <th className="px-4 py-3 font-semibold text-gray-500">Project</th>
                                <th className="px-4 py-3 font-semibold text-gray-500">Status</th>
                                <th className="px-4 py-3 font-semibold text-gray-500">Priority</th>
                                <th className="px-4 py-3 font-semibold text-gray-500">Reporter</th>
                                <th className="px-4 py-3 font-semibold text-gray-500">Assignee</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((b) => (
                                <tr
                                    key={b.id}
                                    onClick={() => navigate(`/bugs/${b.id}`)}
                                    className="cursor-pointer transition-colors hover:bg-blue-50/40"
                                >
                                    <td className="px-4 py-3 font-medium text-gray-800">{b.title}</td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">{b.projectName || "—"}</td>
                                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                                    <td className="px-4 py-3"><PriorityBadge priority={b.priority} /></td>
                                    <td className="px-4 py-3 text-gray-500">{b.createdBy}</td>
                                    <td className="px-4 py-3">
                                        {b.assignedTo ? (
                                            <span className="text-gray-700">{b.assignedTo}</span>
                                        ) : (
                                            <span className="text-xs text-gray-300">Unassigned</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BugsList;
