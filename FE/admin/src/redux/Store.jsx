import { configureStore } from "@reduxjs/toolkit";
import couponReducer from './reducer/admin/couponReducer';
import courseReducer from "./reducer/admin/courseReducer";
import studyReducer from "./reducer/admin/studyReducer";
import userReducer from './reducer/admin/userReducer';
import withdrawReducer from './reducer/admin/withdrawReducer';
import authReducer from './reducer/auth/authReducer';
export const Store = configureStore({
  reducer: {
    userReducer: userReducer,
    studyReducer: studyReducer,
    courseReducer:courseReducer,
    couponReducer: couponReducer,
    authReducer: authReducer,
    withdrawReducer: withdrawReducer
  },
});
