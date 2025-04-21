import http from "../../config/http";

export const updateWallet = async (id, data) => {
    try {
        const response = await http.put(`/wallet/${id}`, data);
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getWallet = async (id) => {
    try {
        const response = await http.get(`/wallet/${id}`);
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getWithdraw = async (id) => {
    try {
        const response = await http.get(`/withdraw/${id}`);
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getSeveralWithdraw = async (fieldIds) => {
    try {
        const requests = fieldIds.map(id => http.get(`/withdraws?filter=wallet.user.id:'${id}'`));
        const responses = await Promise.all(requests);
        const Withdraw = responses.flatMap(res => res.data?.data?.result || []);
        return Withdraw;
    } catch (error) {
        console.error("Failed to fetch Withdraw by field IDs:", error);
        throw error;
    }
};

// export const getSeveralWithdraw = async (id) => {
//     try {
//         const requests = fieldIds.map(id => http.get(`/skills?filter=field.id:'${id}'`));
//         return response.data.data;
//     } catch (error) {
//         throw error.response.data;
//     }
// };

export const createWithdrawRequest = async (data) => {
    try {
        const response = await http.post("/send-withdraw", data);
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const createPayMentByWithdraw = async (data) => {
    try {
        const response = await http.post("/create-withdraw-payment", data);
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
};