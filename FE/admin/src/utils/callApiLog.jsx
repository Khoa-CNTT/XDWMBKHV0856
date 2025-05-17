import { message } from "antd";
import { http } from "../setting/setting";

export const callApiLog = async (id, target, description) => {
  try {
    const payload = {
      user: { id }, 
      target,       
      description   
    };

    const response = await http.post('/v1/log', payload); 

    return response.data;
  } catch (error) {
    message.error('Error logging action:', error);
  }
};
