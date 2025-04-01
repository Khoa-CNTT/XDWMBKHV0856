import http from "../../config/http";

export const createOrder = async (data) => {
  try {
    const response = await http.post("/order", data);
    localStorage.removeItem("cart");
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getOrder = async (id) => {
  try {
    const response = await http.get(`/order/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getOrders = async (data) => {
  try {
    const response = await http.get("/orders", {
      params: data,
    });
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};
