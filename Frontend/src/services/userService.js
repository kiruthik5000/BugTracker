import axiosInstance from "../api/axiosInstance";

export const getAllUsers = () => axiosInstance.get("/users");

export const getUserById = (id) => axiosInstance.get(`/users/${id}`);

export const getUsersByRole = (role) =>
    axiosInstance.get(`/users/role/${role}`);

export const createUser = (data) => axiosInstance.post("/users", data);

export const deleteUser = (id) => axiosInstance.delete(`/users/${id}`);

export const changeRole = (userId, role) =>
    axiosInstance.patch(`/users/${userId}/role?role=${role}`);
