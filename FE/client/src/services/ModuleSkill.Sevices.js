import http from "../../config/http";

export const getFields = async () => {
    try {
        const response = await http.get("/fields");
        return response.data.data.result;  // Return the list of fields
    } catch (error) {
        console.error("Error fetching fields:", error);
        throw error;
    }
};

// Fetch skills based on field IDs
export const getSkillsByFieldIds = async (fieldIds) => {
    try {
        const requests = fieldIds.map(id => http.get(`/skills?filter=field.id:'${id}'`));
        const responses = await Promise.all(requests);
        const allSkills = responses.flatMap(res => res.data?.data?.result || []);
        return allSkills;
    } catch (error) {
        console.error("Failed to fetch skills by field IDs:", error);
        throw error;
    }
};

export const postUserFields = async (payload) => {
    const res = await http.post("/user.field", payload);
    return res.data;
};

export const postUserSkills = async (payload) => {
    const res = await http.post("/user.skill", payload);
    return res.data;
};

