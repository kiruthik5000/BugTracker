import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBugById, deleteBug, changeStatus } from "../services/bugService";
import { getCommentsByBug, createComment } from "../services/commentService";
import { useAuth } from "../auth/AuthContext";
import StatusBadge from "../components/shared/StatusBadge";
import PriorityBadge from "../components/shared/PriorityBadge";
import BugManager from "../components/BugManager";

const BugDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
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
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this bug permanently?")) return;
        try {
            await deleteBug(id);
            navigate("/bugs");
        } catch (err) {
            console.error(err);
        }
    };

    const handleDevStatusChange = async () => {
        if (!devStatus) return;
        try {
            await changeStatus(id, devStatus);
            setDevStatus("");
            load();
        } catch (err) {
            console.error(err);
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
        return <p className="text-center text-gray-400">Bug not found.</p>;
    }

    const canComment = ["TESTER", "DEVELOPER"].includes(user?.role);
    const canManage  = ["PROJECT_MANAGER", "ADMIN"].includes(user?.role);
    const canDelete  = user?.role === "ADMIN";
    const isDeveloperAssigned = user?.role === "DEVELOPER" && bug.assignedTo === user.username;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
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
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Description</h3>
                        <p className="mt-2 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{bug.description || "—"}</p>
                    </div>
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Steps to Reproduce</h3>
                        <p className="mt-2 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{bug.stepsToReproduce || "—"}</p>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 border-t border-gray-100 pt-4 text-sm sm:grid-cols-3">
                    <div>
                        <span className="text-xs font-semibold uppercase text-gray-400">Assigned To</span>
                        <p className="mt-1 font-medium text-gray-700">{bug.assignedTo || "Unassigned"}</p>
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

            {/* Developer — Change Status (only for assigned bugs) */}
            {isDeveloperAssigned && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-base font-semibold text-gray-800">Update Status</h2>
                    <p className="mt-1 text-xs text-gray-500">You can change the status of this bug since it's assigned to you.</p>
                    <div className="mt-4 flex items-center gap-3">
                        <select
                            value={devStatus}
                            onChange={(e) => setDevStatus(e.target.value)}
                            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">Select status...</option>
                            {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REOPENED"]
                                .filter((s) => s !== bug.status)
                                .map((s) => (
                                    <option key={s} value={s}>{s.replace("_", " ")}</option>
                                ))}
                        </select>
                        <button
                            onClick={handleDevStatusChange}
                            disabled={!devStatus}
                            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                        >
                            Update
                        </button>
                    </div>
                </div>
            )}

            {/* Bug Manager (PM / ADMIN) */}
            {canManage && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <BugManager bugId={id} currentBug={bug} onUpdate={load} />
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
                <h2 className="text-base font-semibold text-gray-800">
                    Comments <span className="text-sm font-normal text-gray-400">({comments.length})</span>
                </h2>

                <div className="mt-4 space-y-4">
                    {comments.length === 0 ? (
                        <p className="text-sm text-gray-400">No comments yet.</p>
                    ) : (
                        comments.map((c, i) => (
                            <div key={i} className="rounded-xl bg-gray-50 px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-700">{c.commentedBy}</span>
                                    <span className="text-xs text-gray-400">
                                        {c.commentedAt ? new Date(c.commentedAt).toLocaleString() : ""}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-gray-600">{c.content}</p>
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
