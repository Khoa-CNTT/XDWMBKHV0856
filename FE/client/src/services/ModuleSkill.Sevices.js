import http from "../../config/http";

export const getSkillsByFieldIds = async (fieldIds) => {
    try {
        const requests = fieldIds.map((id) =>
            http.get(`skills?filter=field.id:'${id}'`)
        );

        const responses = await Promise.all(requests);

        // Gộp tất cả kết quả từ các API lại
        const allSkills = responses.flatMap((res) => res.data?.data?.result || []);
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

