import http from "../../../config/http";

export const getReview = async (id) => {
    try {
        const response = await http.get(`/reviews?filter=course.owner.id :${id}`);
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
}