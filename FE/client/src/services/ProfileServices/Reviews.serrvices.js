import http from "../../../config/http";

export const getReview = async (id) => {
    try {
        const response = await http.get(`/reviews?filter=course.owner.id : '${id}'`);
        console.log("API Response:", response.data);
        return response.data.data.result;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        return [];
    }
};
