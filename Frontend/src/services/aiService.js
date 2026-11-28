import axios from "axios";

const aiAxios = axios.create({
    baseURL: import.meta.env.VITE_AI_URL,
});

export const checkDuplicate = (bug) =>
    aiAxios.post("/check-duplicate", {
        id: bug.id || 0,
        title: bug.title,
        description: bug.description,
        steps: bug.stepsToReproduce,
    });
