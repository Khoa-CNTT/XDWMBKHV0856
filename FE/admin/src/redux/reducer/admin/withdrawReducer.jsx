import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import { http } from "../../../setting/setting";

const initialState = {
  apiWithdraw: [],
  meta: {
    page: 1,
    pageSize: 20,
    totalElement: 0,
    totalPage: 0,
  },
};

const withdrawReducer = createSlice({
  name: "withdrawReducer",
  initialState,
  reducers: {
    setAllWithdrawAction: (state, action) => {
      const { result, meta } = action.payload;
      state.apiWithdraw = result;
      state.meta = meta;
    },
    setApproveWithdawAction: (state, action) => {
      const { id } = action.payload;
      state.apiWithdraw = state.apiWithdraw.map(api =>
        api.id === id ? { ...api, orderStatus: "PAID" } : api
      );
    }
    
  },
});

export const { setAllWithdrawAction,setApproveWithdawAction } = withdrawReducer.actions;

export default withdrawReducer.reducer;

export const getAllWithdrawActionAsync = ({ page = 1, size = 20, filters }) => {
  return async (dispatch) => {
    const filterParams = Object.entries(filters || {})
      .filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
      .map(([key, value]) => `filter=${key}~'${value}'`)
      .join("&");
    const queryString = `page=${page}&size=${size}${
      filterParams ? `&${filterParams}` : ""
    }`;
    const res = await http.get(`/v1/withdraws?sort=updatedAt,desc&${queryString}`);
    const result = res.data?.data?.result || [];
    const meta = res.data?.data?.meta || {};
    dispatch(setAllWithdrawAction({ result, meta }));
  };
};

export const ApproveWithdrawActionAsync = (id,status) => {
  return async(dispatch) => {
    try {
      const res = await http.patch(`/v1/withdraw.status`, {
        id: id,
        orderStatus: status,
      });
      dispatch(setApproveWithdawAction({ id }));
      message.success("Payment request approved");
      return res
    } catch (error) {
      message.error(
        `Error while approving: ${
          error?.response?.data?.message || error.message
        }`
      );
    }
  }
}

