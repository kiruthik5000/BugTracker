import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { createBug } from "../services/bugService";
import { getAllProjects } from "../services/projectService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/shared/ToastContext";
import Dropdown from "../components/shared/Dropdown";

const priorityOptions = [
    { value: "LOW", label: "Low", badge: "bg-slate-100 text-slate-600" },
    { value: "MEDIUM", label: "Medium", badge: "bg-blue-100 text-blue-700" },
    { value: "HIGH", label: "High", badge: "bg-orange-100 text-orange-700" },
    { value: "CRITICAL", label: "Critical", badge: "bg-red-100 text-red-700" },
];

const CreateBug = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [submitting, setSubmitting] = useState(false);
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

        if (!bug.projectId) {
            toast.error("Please select a project.");
            return;
        }

        setSubmitting(true);
        try {
            await createBug(
                { ...bug, projectId: Number(bug.projectId) },
                user.id
            );
            toast.success("Bug report submitted successfully!");
            navigate("/bugs");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create bug.");
        }
        setSubmitting(false);
    };

    const projectOptions = projects.map((p) => ({
        value: String(p.id),
        label: p.name,
    }));

    return (
        <div className="mx-auto max-w-xl">
            <h1 className="text-2xl font-bold text-gray-800">Report a Bug</h1>
            <p className="mt-1 text-sm text-gray-400">Fill out the details below to submit a new bug report</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                {/* Project */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Project</label>
                    <Dropdown
                        options={projectOptions}
                        value={bug.projectId}
                        onChange={(val) => setBug({ ...bug, projectId: val })}
                        placeholder="Select a project..."
                        searchable={projects.length > 5}
                    />
                </div>

                {/* Title */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={bug.title}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        placeholder="Brief summary of the bug"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={bug.description}
                        onChange={handleChange}
                        required
                        rows="3"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        placeholder="Detailed description of what went wrong"
                    />
                </div>

                {/* Steps to Reproduce */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Steps to Reproduce</label>
                    <textarea
                        name="stepsToReproduce"
                        value={bug.stepsToReproduce}
                        onChange={handleChange}
                        required
                        rows="3"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        placeholder={"1. Go to ...\n2. Click on ...\n3. Observe error"}
                    />
                </div>

                {/* Priority */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Priority</label>
                    <Dropdown
                        options={priorityOptions}
                        value={bug.priority}
                        onChange={(val) => setBug({ ...bug, priority: val })}
                        placeholder="Select priority..."
                    />
                </div>

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
