import { useEffect, useState } from "react";
import { getAllBugs } from "../services/bugService";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../components/shared/StatusBadge";
import PriorityBadge from "../components/shared/PriorityBadge";

const BugManagerPage = () => {
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getAllBugs()
            .then((res) => setBugs(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

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
                <h1 className="text-2xl font-bold text-gray-800">Bug Manager</h1>
                <p className="mt-1 text-sm text-gray-400">
                    Click Manage to assign developers and change status
                </p>
            </div>

            {bugs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-12 text-center">
                    <p className="text-3xl">🐛</p>
                    <p className="mt-2 text-sm text-gray-400">No bugs found.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/60">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-gray-500">Title</th>
                                <th className="px-4 py-3 font-semibold text-gray-500">Status</th>
                                <th className="px-4 py-3 font-semibold text-gray-500">Priority</th>
                                <th className="px-4 py-3 font-semibold text-gray-500">Assignee</th>
                                <th className="px-4 py-3 font-semibold text-gray-500 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {bugs.map((b) => (
                                <tr key={b.id} className="transition-colors hover:bg-blue-50/40">
                                    <td className="px-4 py-3 font-medium text-gray-800">{b.title}</td>
                                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                                    <td className="px-4 py-3"><PriorityBadge priority={b.priority} /></td>
                                    <td className="px-4 py-3">
                                        {b.assignedTo ? (
                                            <span className="text-gray-700">{b.assignedTo}</span>
                                        ) : (
                                            <span className="text-xs text-gray-300">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => navigate(`/bugs/${b.id}`)}
                                            className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 cursor-pointer"
                                        >
                                            Manage →
                                        </button>
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

export default BugManagerPage;
