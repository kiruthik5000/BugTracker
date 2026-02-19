import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getAllBugs, getCreatedBugs, getAssignedBugs } from "../services/bugService";
import StatusBadge from "../components/shared/StatusBadge";
import PriorityBadge from "../components/shared/PriorityBadge";
import { useNavigate } from "react-router-dom";

const StatCard = ({ label, value, color }) => (
    <div className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm`}>
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p>
    </div>
);

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

    const open = bugs.filter((b) => b.status === "OPEN").length;
    const inProgress = bugs.filter((b) => b.status === "IN_PROGRESS").length;
    const resolved = bugs.filter((b) => b.status === "RESOLVED").length;
    const closed = bugs.filter((b) => b.status === "CLOSED").length;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Overview of all bug reports</p>
            </div>

            {/* Stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Bugs" value={bugs.length} color="text-gray-800" />
                <StatCard label="Open" value={open} color="text-sky-600" />
                <StatCard label="In Progress" value={inProgress} color="text-amber-600" />
                <StatCard label="Resolved" value={resolved} color="text-emerald-600" />
            </div>

            {/* Role-specific section */}
            {user?.role === "TESTER" && (
                <Section title="My Reported Bugs" bugs={myBugs} navigate={navigate} />
            )}
            {user?.role === "DEVELOPER" && (
                <Section title="Assigned to Me" bugs={myBugs} navigate={navigate} />
            )}
            {(user?.role === "PROJECT_MANAGER" || user?.role === "ADMIN") && (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700">All Bugs — Status Breakdown</h2>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <MiniStat label="Open" count={open} color="bg-sky-50 text-sky-700" />
                        <MiniStat label="In Progress" count={inProgress} color="bg-amber-50 text-amber-700" />
                        <MiniStat label="Resolved" count={resolved} color="bg-emerald-50 text-emerald-700" />
                        <MiniStat label="Closed" count={closed} color="bg-gray-100 text-gray-600" />
                    </div>
                    <Section title="Recent Bugs" bugs={bugs.slice(0, 8)} navigate={navigate} />
                </div>
            )}
        </div>
    );
};

const MiniStat = ({ label, count, color }) => (
    <div className={`rounded-xl px-4 py-3 ${color}`}>
        <p className="text-xs font-medium opacity-70">{label}</p>
        <p className="text-xl font-bold">{count}</p>
    </div>
);

const Section = ({ title, bugs, navigate }) => (
    <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        {bugs.length === 0 ? (
            <p className="text-sm text-gray-400">No bugs found.</p>
        ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-100 bg-gray-50/60">
                        <tr>
                            <th className="px-4 py-3 font-medium text-gray-500">Title</th>
                            <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                            <th className="px-4 py-3 font-medium text-gray-500">Priority</th>
                            <th className="px-4 py-3 font-medium text-gray-500">Created</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bugs.map((b) => (
                            <tr
                                key={b.id}
                                className="cursor-pointer transition hover:bg-blue-50/40"
                                onClick={() => navigate(`/bugs/${b.id}`)}
                            >
                                <td className="px-4 py-3 font-medium text-gray-800">{b.title}</td>
                                <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                                <td className="px-4 py-3"><PriorityBadge priority={b.priority} /></td>
                                <td className="px-4 py-3 text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

export default Dashboard;
