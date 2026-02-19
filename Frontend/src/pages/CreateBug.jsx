import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { createBug } from "../services/bugService";
import { getAllProjects } from "../services/projectService";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const CreateBug = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [projects, setProjects] = useState([]);

    const [bug, setBug] = useState({
        title: "",
        description: "",
        stepsToReproduce: "",
        status: "OPEN",
        priority: "MEDIUM",
        projectId: "",
    });

    useEffect(() => {
        getAllProjects()
            .then((res) => setProjects(res.data))
            .catch(console.error);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBug({ ...bug, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!bug.projectId) {
            setError("Please select a project.");
            return;
        }

        setSubmitting(true);
        try {
            await createBug(
                { ...bug, projectId: Number(bug.projectId) },
                user.id
            );
            navigate("/bugs");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create bug.");
        }
        setSubmitting(false);
    };

    return (
        <div className="mx-auto max-w-xl">
            <h1 className="text-2xl font-bold text-gray-800">Report a Bug</h1>
            <p className="mt-1 text-sm text-gray-500">Fill out the details below to submit a new bug report</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                {/* Project */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Project</label>
                    <select
                        name="projectId"
                        value={bug.projectId}
                        onChange={handleChange}
                        required
                        className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="">Select a project...</option>
                        {projects.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={bug.title}
                        onChange={handleChange}
                        required
                        className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        placeholder="Brief summary of the bug"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={bug.description}
                        onChange={handleChange}
                        required
                        rows="3"
                        className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        placeholder="Detailed description of what went wrong"
                    />
                </div>

                {/* Steps to Reproduce */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Steps to Reproduce</label>
                    <textarea
                        name="stepsToReproduce"
                        value={bug.stepsToReproduce}
                        onChange={handleChange}
                        required
                        rows="3"
                        className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        placeholder="1. Go to ...&#10;2. Click on ...&#10;3. Observe error"
                    />
                </div>

                {/* Priority */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                        name="priority"
                        value={bug.priority}
                        onChange={handleChange}
                        required
                        className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="CRITICAL">Critical</option>
                    </select>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                >
                    {submitting ? "Submitting..." : "Submit Bug Report"}
                </button>
            </form>
        </div>
    );
};

export default CreateBug;
