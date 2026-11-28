import axiosInstance from "../api/axiosInstance";
import { getStoredUserId } from "./authService";

export const getAllProjects = () => axiosInstance.get("/projects");

export const createProject = (data) => {
    return axiosInstance.post("/projects", {
        ...data,
        userId: getStoredUserId(),
    });
}

export const assignManager = (projectId, managerId) =>
    axiosInstance.put(`/projects/${projectId}/assign?managerId=${managerId}`);

export const deleteProject = (projectId) =>
    axiosInstance.delete(`/projects/${projectId}`);
