import http from "../config/http";

export const payosSingleCheckout = async (data) => {
  const response = await http.post("/payos/single-checkout", data);
  const responseData = response.data.data;

  // Check if it's a free course (code 308)
  if (responseData.code === 308) {
    return {
      isFree: true,
      orderCode: responseData.data,
    };
  }

  return responseData;
};

export const payosMultipleCheckout = async (data) => {
  const response = await http.post("/payos/multiple-checkout", data);
  return response.data.data;
};
