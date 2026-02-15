import { useState } from "react";

const CreateBug = () => {
  const [bug, setBug] = useState({
    title: "",
    description: "",
    stepsToReproduce: "",
    status: "",
    priority: "",
  });   
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBug({ ...bug, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // send this object to backend
    console.log("Bug Data:", bug);

    // reset form (optional)
    setBug({
      title: "",
      description: "",
      stepsToReproduce: "",
      status: "",
      priority: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-5"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Create Bug
        </h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={bug.title}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={bug.description}
            onChange={handleChange}
            required
            rows="3"
            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Steps to Reproduce */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Steps to Reproduce
          </label>
          <textarea
            name="stepsToReproduce"
            value={bug.stepsToReproduce}
            onChange={handleChange}
            rows="3"
            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            value={bug.status}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">Select Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            name="priority"
            value={bug.priority}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">Select Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Create Bug
        </button>
      </form>
    </div>
  );
};

export default CreateBug;
