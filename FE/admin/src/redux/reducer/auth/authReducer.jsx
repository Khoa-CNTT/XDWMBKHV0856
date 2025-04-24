import { createSlice } from '@reduxjs/toolkit';
import { http } from '../../../setting/setting';

const initialState = {
    apiLogin: []
}

const authReducer = createSlice({
  name: "authReducer",
  initialState,
  reducers: {}
});

export const {} = authReducer.actions

export default authReducer.reducer

export const loginActionAsync = (data) => {
    return async (dispatch) => {
      try {
        const result = await http.post(`/v1/login`, data);
        
        return result.data; 
      } catch (error) {
        throw error;
      }
    };
  };
  