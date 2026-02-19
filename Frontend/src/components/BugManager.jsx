import { useEffect, useState } from "react";
import { assignBug, changeStatus } from "../services/bugService";
import { getUsersByRole } from "../services/userService";
import { useToast } from "../components/shared/ToastContext";
import Dropdown from "../components/shared/Dropdown";

const statusOptions = [
    { value: "OPEN", label: "Open", color: "bg-sky-400" },
    { value: "IN_PROGRESS", label: "In Progress", color: "bg-amber-400" },
    { value: "RESOLVED", label: "Resolved", color: "bg-emerald-400" },
    { value: "CLOSED", label: "Closed", color: "bg-gray-400" },
    { value: "REOPENED", label: "Reopened", color: "bg-rose-400" },
];

const BugManager = ({ bug, onUpdate }) => {
    const toast = useToast();
    const [developers, setDevelopers] = useState([]);
    const [selectedDev, setSelectedDev] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(bug?.status || "");
    const [saving, setSaving] = useState(false);

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
        try {
            await assignBug(bug.id, selectedDev);
            toast.success("Developer assigned successfully.");
            onUpdate();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to assign.");
        }
        setSaving(false);
    };

    const handleStatusChange = async () => {
        if (!selectedStatus || selectedStatus === bug.status) return;
        setSaving(true);
        try {
            await changeStatus(bug.id, selectedStatus);
            toast.success("Status updated successfully.");
            onUpdate();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update status.");
        }
        setSaving(false);
    };

    const devOptions = developers.map((d) => ({
        value: String(d.id),
        label: d.username,
    }));

    return (
        <div className="space-y-5">
            <h2 className="text-lg font-bold text-gray-800">Bug Manager</h2>

            {/* Assign Developer */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Assign to Developer</label>
                <div className="flex gap-3">
                    <Dropdown
                        options={devOptions}
                        value={selectedDev}
                        onChange={setSelectedDev}
                        placeholder="Select developer..."
                        searchable={developers.length > 5}
                        className="flex-1"
                    />
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
                    <Dropdown
                        options={statusOptions}
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                        placeholder="Select status..."
                        className="flex-1"
                    />
                    <button
                        onClick={handleStatusChange}
                        disabled={saving || selectedStatus === bug.status}
                        className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BugManager;
