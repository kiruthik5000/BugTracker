import axiosInstance from "../api/axiosInstance";

export const getCommentsByBug = (bugId) =>
    axiosInstance.get(`/comments/bug/${bugId}`);

export const createComment = (data) =>
    axiosInstance.post("/comments", data);
