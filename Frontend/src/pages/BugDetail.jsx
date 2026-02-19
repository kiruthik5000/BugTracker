import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBugById, deleteBug, changeStatus } from "../services/bugService";
import { getCommentsByBug, createComment } from "../services/commentService";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../components/shared/ToastContext";
import StatusBadge from "../components/shared/StatusBadge";
import PriorityBadge from "../components/shared/PriorityBadge";
import BugManager from "../components/BugManager";
import Dropdown from "../components/shared/Dropdown";

const statusOptions = [
    { value: "OPEN", label: "Open", color: "bg-sky-400" },
    { value: "IN_PROGRESS", label: "In Progress", color: "bg-amber-400" },
    { value: "RESOLVED", label: "Resolved", color: "bg-emerald-400" },
    { value: "CLOSED", label: "Closed", color: "bg-gray-400" },
    { value: "REOPENED", label: "Reopened", color: "bg-rose-400" },
];

const BugDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [bug, setBug] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [devStatus, setDevStatus] = useState("");

    const load = async () => {
        try {
            const [bugRes, commRes] = await Promise.all([
                getBugById(id),
                getCommentsByBug(id),
            ]);
            setBug(bugRes.data);
            setComments(commRes.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => { load(); }, [id]);

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await createComment({ bugId: id, createdBy: user.id, message: newComment });
            setNewComment("");
            const res = await getCommentsByBug(id);
            setComments(res.data);
            toast.success("Comment posted.");
        } catch (err) {
            toast.error("Failed to post comment.");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this bug permanently?")) return;
        try {
            await deleteBug(id);
            toast.success("Bug deleted.");
            navigate("/bugs");
        } catch (err) {
            toast.error("Failed to delete bug.");
        }
    };

    const handleDevStatusChange = async () => {
        if (!devStatus) return;
        try {
            await changeStatus(id, devStatus);
            setDevStatus("");
            toast.success("Status updated.");
            load();
        } catch (err) {
            toast.error("Failed to update status.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" />
            </div>
        );
    }

    if (!bug) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-16 text-center">
                <p className="text-3xl">🔍</p>
                <p className="mt-2 text-sm text-gray-400">Bug not found.</p>
                <button onClick={() => navigate("/bugs")} className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700">
                    ← Back to bugs
                </button>
            </div>
        );
    }

    const canComment = ["TESTER", "DEVELOPER"].includes(user?.role);
    const canManage = ["PROJECT_MANAGER", "ADMIN"].includes(user?.role);
    const canDelete = user?.role === "ADMIN";
    const isDeveloperAssigned = user?.role === "DEVELOPER" && bug.assignedTo === user.username;

    const devStatusOptions = statusOptions.filter((s) => s.value !== bug.status);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <button onClick={() => navigate("/bugs")} className="mb-2 text-xs font-medium text-gray-400 transition hover:text-blue-600">
                        ← Back to bugs
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">{bug.title}</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Reported by <span className="font-medium text-gray-700">{bug.createdBy}</span>
                        {bug.projectName && <> in <span className="font-medium text-blue-600">{bug.projectName}</span></>}
                        {" · "}
                        {new Date(bug.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <StatusBadge status={bug.status} />
                    <PriorityBadge priority={bug.priority} />
                </div>
            </div>

            {/* Info Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                            <span>📝</span> Description
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{bug.description || "—"}</p>
                    </div>
                    <div>
                        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                            <span>🔄</span> Steps to Reproduce
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{bug.stepsToReproduce || "—"}</p>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 border-t border-gray-100 pt-4 text-sm sm:grid-cols-3">
                    <div>
                        <span className="text-xs font-semibold uppercase text-gray-400">Assigned To</span>
                        <p className="mt-1 font-medium text-gray-700">{bug.assignedTo || <span className="text-gray-300">Unassigned</span>}</p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold uppercase text-gray-400">Project</span>
                        <p className="mt-1 font-medium text-gray-700">{bug.projectName || "—"}</p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold uppercase text-gray-400">Created</span>
                        <p className="mt-1 font-medium text-gray-700">{new Date(bug.createdAt).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Developer — Change Status */}
            {isDeveloperAssigned && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-base font-bold text-gray-800">Update Status</h2>
                    <p className="mt-1 text-xs text-gray-400">You can change the status since this bug is assigned to you.</p>
                    <div className="mt-4 flex items-center gap-3">
                        <Dropdown
                            options={devStatusOptions}
                            value={devStatus}
                            onChange={setDevStatus}
                            placeholder="Select status..."
                            className="w-56"
                        />
                        <button
                            onClick={handleDevStatusChange}
                            disabled={!devStatus}
                            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                        >
                            Update
                        </button>
                    </div>
                </div>
            )}

            {/* Bug Manager (PM / ADMIN) */}
            {canManage && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <BugManager bug={bug} onUpdate={load} />
                </div>
            )}

            {/* Admin Delete */}
            {canDelete && (
                <div className="flex justify-end">
                    <button
                        onClick={handleDelete}
                        className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                        Delete Bug
                    </button>
                </div>
            )}

            {/* Comments */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-gray-800">
                    Comments <span className="text-sm font-normal text-gray-400">({comments.length})</span>
                </h2>

                <div className="mt-4 space-y-3">
                    {comments.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 py-6 text-center">
                            <p className="text-sm text-gray-400">No comments yet. Be the first to comment.</p>
                        </div>
                    ) : (
                        comments.map((c, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-600 to-gray-800 text-[10px] font-bold text-white">
                                    {c.commentedBy?.charAt(0)?.toUpperCase() || "?"}
                                </div>
                                <div className="flex-1 rounded-xl bg-gray-50 px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-700">{c.commentedBy}</span>
                                        <span className="text-xs text-gray-400">
                                            {c.commentedAt ? new Date(c.commentedAt).toLocaleString() : ""}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-600">{c.content}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {canComment && (
                    <form onSubmit={handleComment} className="mt-4 flex gap-3">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                        <button
                            type="submit"
                            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                            Post
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default BugDetail;
