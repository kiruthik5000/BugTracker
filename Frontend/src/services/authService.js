import axiosInstance from "../api/axiosInstance";

export const loginUser = async (credentials) => {
    const response = await axiosInstance.post("/auth/login", credentials);

    localStorage.setItem("token", response.data.token);
    return response.data;
};

export const logoutUser = () => {
    localStorage.removeItem("token");
};