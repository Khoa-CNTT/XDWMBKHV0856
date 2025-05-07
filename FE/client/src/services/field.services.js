import http from "../../config/http";

export const getFields = async () => {
  const response = await http.get("/v1/fields");
  return response.data;
};

export const getSkills = async () => {
  const response = await http.get("/v1/skills");
  return response.data;
};
