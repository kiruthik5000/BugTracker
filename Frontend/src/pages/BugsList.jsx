import { useEffect, useState } from "react";
import { getAllBugs } from "../services/bugService";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../components/shared/StatusBadge";
import PriorityBadge from "../components/shared/PriorityBadge";

const BugsList = () => {
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const navigate = useNavigate();

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
            <div>
                <h1 className="text-2xl font-bold text-gray-800">All Bugs</h1>
                <p className="mt-1 text-sm text-gray-500">{bugs.length} bugs total</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                    <option value="">All statuses</option>
                    {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REOPENED"].map((s) => (
                        <option key={s} value={s}>{s.replace("_", " ")}</option>
                    ))}
                </select>
                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                    <option value="">All priorities</option>
                    {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
                <p className="text-sm text-gray-400">No bugs match your filters.</p>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/60">
                            <tr>
                                <th className="px-4 py-3 font-medium text-gray-500">Title</th>
                                <th className="px-4 py-3 font-medium text-gray-500">Project</th>
                                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                                <th className="px-4 py-3 font-medium text-gray-500">Priority</th>
                                <th className="px-4 py-3 font-medium text-gray-500">Reported By</th>
                                <th className="px-4 py-3 font-medium text-gray-500">Assigned To</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map((b) => (
                                <tr
                                    key={b.id}
                                    onClick={() => navigate(`/bugs/${b.id}`)}
                                    className="cursor-pointer transition hover:bg-blue-50/40"
                                >
                                    <td className="px-4 py-3 font-medium text-gray-800">{b.title}</td>
                                    <td className="px-4 py-3 text-gray-600">{b.projectName || "—"}</td>
                                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                                    <td className="px-4 py-3"><PriorityBadge priority={b.priority} /></td>
                                    <td className="px-4 py-3 text-gray-600">{b.createdBy}</td>
                                    <td className="px-4 py-3 text-gray-600">{b.assignedTo || "Unassigned"}</td>
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
