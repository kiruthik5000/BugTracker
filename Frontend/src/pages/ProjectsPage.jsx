import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getAllProjects, createProject, assignManager, deleteProject } from "../services/projectService";
import { getUsersByRole } from "../services/userService";
import Modal from "../components/shared/Modal";

const ProjectsPage = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newProject, setNewProject] = useState({ name: "", description: "", userId: "" });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const load = async () => {
        try {
            const [projRes, mgrRes] = await Promise.all([
                getAllProjects(),
                getUsersByRole("PROJECT_MANAGER"),
            ]);
            setProjects(projRes.data);
            setManagers(mgrRes.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleCreate = async () => {
        if (!newProject.name.trim()) return;
        setSaving(true);
        try {
            await createProject(newProject);
            setNewProject({ name: "", description: "" });
            setShowCreate(false);
            setMessage("Project created successfully.");
            load();
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to create project.");
        }
        setSaving(false);
    };

    const handleAssign = async (projectId, managerId) => {
        if (!managerId) return;
        try {
            await assignManager(projectId, managerId);
            setMessage("Manager assigned.");
            load();
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to assign manager.");
        }
    };

    const handleDelete = async (projectId) => {
        if (!window.confirm("Delete this project?")) return;
        try {
            await deleteProject(projectId);
            setMessage("Project deleted.");
            load();
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to delete project.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" />
            </div>
        );
    }

    const isAdmin = user?.role === "ADMIN";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage projects and assign managers</p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                    + New Project
                </button>
            </div>

            {message && (
                <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
                    {message}
                    <button onClick={() => setMessage("")} className="ml-3 text-blue-400 hover:text-blue-600">&times;</button>
                </div>
            )}

            {projects.length === 0 ? (
                <p className="text-sm text-gray-400">No projects yet. Create one to get started.</p>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/60">
                            <tr>
                                <th className="px-4 py-3 font-medium text-gray-500">Name</th>
                                <th className="px-4 py-3 font-medium text-gray-500">Description</th>
                                <th className="px-4 py-3 font-medium text-gray-500">Managed By</th>
                                <th className="px-4 py-3 font-medium text-gray-500">Created</th>
                                {isAdmin && <th className="px-4 py-3 font-medium text-gray-500">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {projects.map((p) => (
                                <tr key={p.id} className="transition hover:bg-blue-50/30">
                                    <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{p.description || "—"}</td>
                                    <td className="px-4 py-3">
                                        {isAdmin ? (
                                            <select
                                                value=""
                                                onChange={(e) => handleAssign(p.id, e.target.value)}
                                                className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                            >
                                                <option value="">{p.assignedTo || "Assign..."}</option>
                                                {managers.map((m) => (
                                                    <option key={m.id} value={m.id}>{m.username}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className="text-gray-600">{p.assignedTo || "Unassigned"}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}</td>
                                    {isAdmin && (
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create Project Modal */}
            <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Project">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Project Name</label>
                        <input
                            type="text"
                            value={newProject.name}
                            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                            className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder="e.g. E-commerce Platform"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                            rows="3"
                            className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder="Brief description of the project"
                        />
                    </div>
                    <button
                        onClick={handleCreate}
                        disabled={saving}
                        className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? "Creating..." : "Create Project"}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default ProjectsPage;
