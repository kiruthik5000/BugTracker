import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  getAllProjects,
  createProject,
  assignManager,
  deleteProject,
} from "../services/projectService";
import { getUsersByRole } from "../services/userService";
import { useToast } from "../components/shared/ToastContext";
import Modal from "../components/shared/Modal";
import Dropdown from "../components/shared/Dropdown";

const ProjectsPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [projects, setProjects] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  });

  const isAdmin = user?.role === "ADMIN";

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [projRes, mgrRes] = await Promise.all([
        getAllProjects(),
        getUsersByRole("PROJECT_MANAGER"),
      ]);

      setProjects(projRes?.data || []);
      setManagers(mgrRes?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async () => {
    if (!newProject.name.trim()) return;

    try {
      setSaving(true);
      await createProject(newProject);
      toast.success("Project created successfully.");
      setNewProject({ name: "", description: "" });
      setShowCreate(false);
      load();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to create project."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAssign = async (projectId, managerId) => {
    if (!managerId) return;

    try {
      await assignManager(projectId, managerId);
      toast.success("Manager assigned.");
      load();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to assign manager."
      );
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await deleteProject(projectId);
      toast.success("Project deleted.");
      load();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to delete project."
      );
    }
  };

  const managerOptions = managers.map((m) => ({
    value: String(m.id),
    label: m.username,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
          <p className="mt-1 text-sm text-gray-400">
            Manage projects and assign managers
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + New Project
          </button>
        )}
      </div>

      {/* Empty State */}
      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-12 text-center">
          <p className="text-3xl">📁</p>
          <p className="mt-2 text-sm text-gray-400">
            No projects yet. Create one to get started.
          </p>
        </div>
      ) : (
        <div className="relative overflow-visible rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50/60">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-500">
                  Name
                </th>
                <th className="px-4 py-3 font-semibold text-gray-500">
                  Description
                </th>
                <th className="px-4 py-3 font-semibold text-gray-500">
                  Managed By
                </th>
                <th className="px-4 py-3 font-semibold text-gray-500">
                  Created
                </th>
                {isAdmin && (
                  <th className="px-4 py-3 text-right font-semibold text-gray-500">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {projects.map((p) => (
                <tr
                  key={p.id}
                  className="transition-colors hover:bg-blue-50/30"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {p.name}
                  </td>

                  <td className="max-w-xs truncate px-4 py-3 text-xs text-gray-500">
                    {p.description || "—"}
                  </td>

                  <td className="relative px-4 py-3">
                    {isAdmin ? (
                      <div className="relative z-50">
                        <Dropdown
                          options={managerOptions}
                          value=""
                          onChange={(val) =>
                            handleAssign(p.id, val)
                          }
                          placeholder={
                            p.assignedTo || "Assign..."
                          }
                          className="w-40"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-600">
                        {p.assignedTo || (
                          <span className="text-gray-300">
                            Unassigned
                          </span>
                        )}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-xs text-gray-400">
                    {p.createdAt
                      ? new Date(
                          p.createdAt
                        ).toLocaleDateString()
                      : "—"}
                  </td>

                  {isAdmin && (
                    <td className="px-4 py-3 text-right">
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

      {/* Create Modal */}
      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Project"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              type="text"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  name: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="e.g. E-commerce Platform"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows="3"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  description: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
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
