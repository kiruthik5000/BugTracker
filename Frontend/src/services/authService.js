import axiosInstance from "../api/axiosInstance";

export const loginUser = async (credentials) => {
    const response = await axiosInstance.post("/auth/login", credentials);
    console.log(response.data);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userId", response.data.userId);
    return response.data;
};

export const registerUser = async (data) => {
    const response = await axiosInstance.post("/auth/register", data);
    localStorage.setItem("token", response.data.token);
    return response.data;
};

export const logoutUser = () => {
    console.log("logout");

    localStorage.removeItem("token");
};

export const decodeToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return { username: payload.sub, role: payload.role };
    } catch {
        return null;
    }
};