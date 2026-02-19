import axiosInstance from "../api/axiosInstance";

export const getAllProjects = () => axiosInstance.get("/projects");

export const createProject = (data) => {
    data.userId = localStorage.getItem("userId");
    return axiosInstance.post("/projects", data);
}

export const assignManager = (projectId, managerId) =>
    axiosInstance.put(`/projects/${projectId}/assign?managerId=${managerId}`);

export const deleteProject = (projectId) =>
    axiosInstance.delete(`/projects/${projectId}`);
