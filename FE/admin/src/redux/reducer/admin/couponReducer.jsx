import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import { http } from '../../../setting/setting';

const initialState = {
    apiCoupon: [],
    meta: {
        page: 1,
        size: 20,
        totalPage: 0,
        totalElement: 0
      }
}

const couponReducer = createSlice({
    name: "couponReducer",
    initialState,
    reducers: {
        setAllCouponAction: (state, action) => {
            const { result, meta } = action.payload;
            state.apiCoupon = Array.isArray(result) ? result : [];
            state.meta = meta || state.meta;
        },
        setAddCouponAction: (state, action) => {
            state.apiCoupon.push(action.payload)
        },
        setUpdateCouponAction: (state, action) => {
            const updateCoupon = action.payload
            const index = state.apiCoupon.findIndex(coupon => coupon.id === updateCoupon.id)
            if (index !== -1) {
                state.apiCoupon[index] = updateCoupon
            }
        },
        setDeleteCouponAction: (state, action) => {
            state.apiCoupon = state.apiCoupon.filter(coupon => coupon.id !== action.payload)
        }
    }
});

export const { setAllCouponAction, setAddCouponAction, setUpdateCouponAction, setDeleteCouponAction } = couponReducer.actions

export default couponReducer.reducer

export const getAllCouponActionAsync = ({ page = 1, size = 20, filters }) => async (dispatch) => {
    try {
        console.log({filters})
      const filterParams = Object.entries(filters || {})
        .filter(([_, value]) => value !== null && value !== undefined && value !== "")
        .map(([key, value]) => `filter=${key}~'${value}'`)
        .join("&");
  
      const queryString = `?page=${page}&size=${size}${filterParams ? `&${filterParams}` : ""}`;
  
      const res = await http.get(`/v1/coupons${queryString}`);
      const result = res.data?.data?.result || [];
      const meta = res.data?.data?.meta || {};
      dispatch(setAllCouponAction({ result, meta }));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách Coupon");
    }
  };

export const addCouponActionAsync = (formData) => {
    return async (dispatch) => {
        try {
            const res = await http.post(`/v1/coupon`, formData)
            if (res.status === 201) {
                message.success("Thêm Coupon thành công!");
                dispatch(setAddCouponAction(res.data.data));
            }
        } catch (error) {
            console.log(error)
            message.error(`Lỗi khi thêm Coupon: ${error} `);
        }
    }
}

export const updateCouponActionAsync = (formData) => {
    return async (dispatch) => {
        try {
            const res = await http.put(`/v1/coupon`, formData)
            if (res.status === 200) {
                message.success("Cập nhật Coupon thành công!");
                dispatch(setUpdateCouponAction(res.data.data));
            }
        } catch (error) {
            const errMsg =
                error?.response?.data?.message || "Đã xảy ra lỗi không xác định";
            message.error("Lỗi khi cập nhật Coupon: " + errMsg);

        }
    }
}

export const deleteCouponActionAsync = (idCoupon) => {
    return async (dispatch) => {
        try {
            await http.delete(`/v1/coupon/${idCoupon}`)
            message.success("Xóa Coupon thành công!");
            dispatch(setDeleteCouponAction(idCoupon));
        } catch (error) {
            message.error(`Failed to delete Coupon: ${error}`);
        }
    }
}
