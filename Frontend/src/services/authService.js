import axiosInstance from "../api/axiosInstance";

const saveAuthData = (data) => {
    if (data?.token) {
        localStorage.setItem("token", data.token);
    }
    const uid = data?.userId ?? data?.id;
    if (uid != null) {
        localStorage.setItem("userId", String(uid));
    }
};

export const getStoredUserId = () => {
    const uid = localStorage.getItem("userId");
    if (!uid || uid === "undefined" || uid === "null") return null;
    return uid;
};

export const loginUser = async (credentials) => {
    const response = await axiosInstance.post("/auth/login", credentials);
    saveAuthData(response.data);
    return response.data;
};

export const registerUser = async (data) => {
    const response = await axiosInstance.post("/auth/register", data);
    saveAuthData(response.data);
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await axiosInstance.post("/auth/forgot-password", { email });
    return response.data;
};

export const compareCode = async (email, inputCode) => {
    const response = await axiosInstance.post("/auth/compare-code", {
        email,
        "input-code": inputCode,
    });
    return response.data;
};

export const resetPassword = async ({ email, newPassword }) => {
    const response = await axiosInstance.post("/auth/reset-password", {
        email,
        newPassword,
    });
    return response.data;
};

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
};

export const decodeToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return {
            id: payload.userId ?? payload.id ?? null,
            username: payload.sub,
            role: payload.role,
        };
    } catch {
        return null;
    }
};