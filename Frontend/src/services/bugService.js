import axiosInstance from "../api/axiosInstance";

export const getAllBugs = () => axiosInstance.get("/bugs");

export const getBugById = (id) => axiosInstance.get(`/bugs/${id}`);

export const getCreatedBugs = (userId) =>
    axiosInstance.get(`/bugs/user/${userId}/created`);

export const getAssignedBugs = (userId) =>
    axiosInstance.get(`/bugs/user/${userId}/assigned`);

export const createBug = (bug, createdBy) =>
    axiosInstance.post(`/bugs?createdBy=${createdBy}`, bug);

export const deleteBug = (id) => axiosInstance.delete(`/bugs/${id}`);

export const assignBug = (bugId, userId) =>
    axiosInstance.put(`/bugs/${bugId}/assign?userId=${userId}`);

export const changeStatus = (bugId, status) =>
    axiosInstance.put(`/bugs/${bugId}/changeStatus?changeTo=${status}`);
