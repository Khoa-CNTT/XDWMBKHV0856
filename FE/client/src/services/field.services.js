import http from "../../config/http";

export const getFields = async () => {
  const response = await http.get("/fields");
  return response.data.data;
};
