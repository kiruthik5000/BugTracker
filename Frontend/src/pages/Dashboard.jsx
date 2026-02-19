import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getAllBugs, getCreatedBugs, getAssignedBugs } from "../services/bugService";
import StatusBadge from "../components/shared/StatusBadge";
import PriorityBadge from "../components/shared/PriorityBadge";
import { useNavigate } from "react-router-dom";

const statConfig = [
    { key: "total", label: "Total Bugs", color: "from-gray-500 to-gray-700", textColor: "text-gray-700", bg: "bg-gray-50" },
    { key: "open", label: "Open", color: "from-sky-400 to-sky-600", textColor: "text-sky-700", bg: "bg-sky-50" },
    { key: "inProgress", label: "In Progress", color: "from-amber-400 to-amber-600", textColor: "text-amber-700", bg: "bg-amber-50" },
    { key: "resolved", label: "Resolved", color: "from-emerald-400 to-emerald-600", textColor: "text-emerald-700", bg: "bg-emerald-50" },
];

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bugs, setBugs] = useState([]);
    const [myBugs, setMyBugs] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="space-y-8">
            {/* Stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statConfig.map((s) => (
                    <div key={s.key} className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md`}>
                        <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${s.color}`} />
                        <p className="pl-3 text-sm font-medium text-gray-500">{s.label}</p>
                        <p className={`mt-1 pl-3 text-3xl font-extrabold ${s.textColor}`}>{counts[s.key]}</p>
                    </div>
                ))}
            </div>

            {/* Role-specific section */}
            {user?.role === "TESTER" && (
                <Section title="My Reported Bugs" bugs={myBugs} navigate={navigate} emptyMsg="You haven't reported any bugs yet." />
            )}
            {user?.role === "DEVELOPER" && (
                <Section title="Assigned to Me" bugs={myBugs} navigate={navigate} emptyMsg="No bugs assigned to you." />
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
                    <Section title="Recent Bugs" bugs={bugs.slice(0, 8)} navigate={navigate} emptyMsg="No bugs found." />
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
