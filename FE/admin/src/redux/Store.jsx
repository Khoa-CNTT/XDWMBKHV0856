import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./reducer/admin/courseReducer";
import studyReducer from "./reducer/admin/studyReducer";
import userReducer from './reducer/admin/userReducer';
export const Store = configureStore({
  reducer: {
    userReducer: userReducer,
    studyReducer: studyReducer,
    courseReducer:courseReducer,
  },
});
