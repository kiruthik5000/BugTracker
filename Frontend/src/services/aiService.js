import axios from "axios";

const aiAxios = axios.create({
    baseURL: "http://localhost:8000",
});

export const checkDuplicate = (bug) =>
    aiAxios.post("/check-duplicate", {
        id: bug.id || 0,
        title: bug.title,
        description: bug.description,
        steps: bug.stepsToReproduce,
    });
