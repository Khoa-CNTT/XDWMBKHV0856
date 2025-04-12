import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import { http } from '../../../setting/setting';

const initialState = {
    apiCoupon: []
}

const couponReducer = createSlice({
    name: "couponReducer",
    initialState,
    reducers: {
        setAllCouponAction: (state, action) => {
            state.apiCoupon = action.payload
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

export const getAllCouponActionAsync = () => {
    return async (dispatch) => {
        try {
            const res = await http.get(`/v1/coupons`)
            const data = await res.data?.data?.result || []
            dispatch(setAllCouponAction(data))
        } catch (error) {
            message.error("Lỗi khi lấy dữ liệu")
        }
    }
}

export const addCouponActionAsync = (formData) => {
    return async (dispatch) => {
        try {
            const res = await http.post(`/v1/coupon`, formData)
            if (res.status === 201) {
                message.success("Thêm Coupon thành công!");
                dispatch(setAddCouponAction(res.data.data));
            }
        } catch (error) {
            message.error("Lỗi khi thêm khóa học:", error);
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
            console.log(idCoupon)
            await http.delete(`/v1/coupon/${idCoupon}`)
            message.success("Xóa Coupon thành công!");
            dispatch(setDeleteCouponAction(idCoupon));
        } catch (error) {
            message.error("Lỗi khi xoa Coupon: ", error);
        }
    }
}