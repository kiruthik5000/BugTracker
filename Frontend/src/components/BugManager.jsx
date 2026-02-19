import { useEffect, useState } from "react";
import { assignBug, changeStatus } from "../services/bugService";
import { getUsersByRole } from "../services/userService";

const statusOptions = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REOPENED"];

const BugManager = ({ bug, onUpdate }) => {
    const [developers, setDevelopers] = useState([]);
    const [selectedDev, setSelectedDev] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(bug?.status || "");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        getUsersByRole("DEVELOPER")
            .then((res) => setDevelopers(res.data))
            .catch(console.error);
    }, []);

    useEffect(() => {
        setSelectedStatus(bug?.status || "");
    }, [bug]);

    const handleAssign = async () => {
        if (!selectedDev) return;
        setSaving(true);
        setMessage("");
        try {
            await assignBug(bug.id, selectedDev);
            setMessage("Developer assigned successfully.");
            onUpdate();
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to assign.");
        }
        setSaving(false);
    };

    const handleStatusChange = async () => {
        if (!selectedStatus || selectedStatus === bug.status) return;
        setSaving(true);
        setMessage("");
        try {
            await changeStatus(bug.id, selectedStatus);
            setMessage("Status updated successfully.");
            onUpdate();
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to update status.");
        }
        setSaving(false);
    };

    return (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gray-800">Bug Manager</h2>

            {/* Assign Developer */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Assign to Developer</label>
                <div className="flex gap-3">
                    <select
                        value={selectedDev}
                        onChange={(e) => setSelectedDev(e.target.value)}
                        className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="">Select developer...</option>
                        {developers.map((d) => (
                            <option key={d.id} value={d.id}>{d.username}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleAssign}
                        disabled={saving || !selectedDev}
                        className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
                    >
                        Assign
                    </button>
                </div>
            </div>

            {/* Change Status */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Change Status</label>
                <div className="flex gap-3">
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                        {statusOptions.map((s) => (
                            <option key={s} value={s}>{s.replace("_", " ")}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleStatusChange}
                        disabled={saving || selectedStatus === bug.status}
                        className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                        Update
                    </button>
                </div>
            </div>

            {message && <p className="text-sm font-medium text-indigo-700">{message}</p>}
        </div>
    );
};

export default BugManager;
