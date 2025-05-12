import http from "../config/http";

export const payosSingleCheckout = async (data) => {
  const response = await http.post("/payos/single-checkout", data);
  return response.data.data;
};

export const payosMultipleCheckout = async (data) => {
  const response = await http.post("/payos/multiple-checkout", data);
  return response.data.data;
};
