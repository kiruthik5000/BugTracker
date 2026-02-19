import { useEffect, useState } from "react";
import { getAllUsers, createUser, deleteUser, changeRole } from "../services/userService";
import { useToast } from "../components/shared/ToastContext";
import Modal from "../components/shared/Modal";
import Dropdown from "../components/shared/Dropdown";

const roles = ["DEVELOPER", "TESTER", "PROJECT_MANAGER", "ADMIN"];

const roleBadgeColors = {
    ADMIN: "bg-purple-100 text-purple-700",
    PROJECT_MANAGER: "bg-indigo-100 text-indigo-700",
    DEVELOPER: "bg-emerald-100 text-emerald-700",
    TESTER: "bg-amber-100 text-amber-700",
};

const roleOptions = roles.map((r) => ({
    value: r,
    label: r.replace("_", " "),
    badge: roleBadgeColors[r] || "bg-gray-100 text-gray-600",
}));

const UsersPage = () => {
    const toast = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [saving, setSaving] = useState(false);
    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
        role: "DEVELOPER",
    });

    const load = async () => {
        try {
            const res = await getAllUsers();
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleCreate = async () => {
        if (!newUser.username.trim() || !newUser.email.trim() || !newUser.password.trim()) {
            toast.error("All fields are required.");
            return;
        }
        setSaving(true);
        try {
            await createUser(newUser);
            setNewUser({ username: "", email: "", password: "", role: "DEVELOPER" });
            setShowCreate(false);
            toast.success("User created successfully.");
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create user.");
        }
        setSaving(false);
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await changeRole(userId, newRole);
            toast.success("Role updated.");
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to change role.");
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Delete this user permanently?")) return;
        try {
            await deleteUser(userId);
            toast.success("User deleted.");
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete user.");
        }
    };

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
                    <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                    <p className="mt-1 text-sm text-gray-400">Create, manage, and assign roles to users</p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                    + Create User
                </button>
            </div>

            {users.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-12 text-center">
                    <p className="text-3xl">👥</p>
                    <p className="mt-2 text-sm text-gray-400">No users found.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/60">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-gray-500">User</th>
                                <th className="px-4 py-3 font-semibold text-gray-500">Role</th>
                                <th className="px-4 py-3 font-semibold text-gray-500">Change Role</th>
                                <th className="px-4 py-3 font-semibold text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((u) => {
                                const changeOptions = roleOptions.filter((r) => r.value !== u.role);
                                return (
                                    <tr key={u.id} className="transition-colors hover:bg-blue-50/30">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-600 to-gray-800 text-xs font-bold text-white">
                                                    {u.username?.charAt(0)?.toUpperCase() || "?"}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{u.username}</p>
                                                    <p className="text-xs text-gray-400">ID: {u.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadgeColors[u.role] || "bg-gray-100 text-gray-600"}`}>
                                                {u.role?.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Dropdown
                                                options={changeOptions}
                                                value=""
                                                onChange={(val) => handleRoleChange(u.id, val)}
                                                placeholder="Change to..."
                                                className="w-44"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create User Modal */}
            <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create User">
                <div className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder="johndoe"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder="john@team.com"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Role</label>
                        <Dropdown
                            options={roleOptions}
                            value={newUser.role}
                            onChange={(val) => setNewUser({ ...newUser, role: val })}
                            placeholder="Select role..."
                        />
                    </div>
                    <button
                        onClick={handleCreate}
                        disabled={saving}
                        className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? "Creating..." : "Create User"}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default UsersPage;
