import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import { http } from "../../../setting/setting";

const initialState = {
  userApi: [],
  meta: {
    page: 1,
    size: 20,
    totalPage: 0,
    totalElement: 0
  }
};


const userSlice = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    setAllUserAction: (state, action) => {
      const { result, meta } = action.payload;
      state.userApi = Array.isArray(result) ? result : [];
      state.meta = meta || state.meta;
    },
    addUserAction: (state, action) => {
      state.userApi.unshift(action.payload);
    },
    updateUserAction: (state, action) => {
      const updatedUser = action.payload;
      state.userApi = state.userApi.map(user =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      );
    },
    deleteUserAction: (state, action) => {
      state.userApi = state.userApi.filter(user => user.id !== action.payload);
    },
    deleteUsersAction: (state, action) => {
      const ids = action.payload;
      state.userApi = state.userApi.filter(user => !ids.includes(user.id));
    },
    updateUserActiveAction: (state, action) => {
      const { userID, newActive } = action.payload;
      state.userApi = state.userApi.map(user =>
        user.id === userID ? { ...user, active: newActive } : user
      );
    }
  }
});


export const {
  setAllUserAction,
  addUserAction,
  updateUserAction,
  deleteUserAction,
  deleteUsersAction,
  updateUserActiveAction
} = userSlice.actions;
export default userSlice.reducer;

export const getAllUserActionAsync = ({ page = 1, size = 20, filters }) => async (dispatch) => {
  try {
    const filterParams = Object.entries(filters || {})
      .filter(([_, value]) => value !== null && value !== undefined && value !== "")
      .map(([key, value]) => `filter=${key}~'${value}'`)
      .join("&");

    const queryString = `?page=${page}&size=${size}${filterParams ? `&${filterParams}` : ""}`;

    const res = await http.get(`/v1/users${queryString}`);
    const result = res.data?.data?.result || [];
    const meta = res.data?.data?.meta || {};
    dispatch(setAllUserAction({ result, meta }));
  } catch (error) {
    console.error("Lỗi khi lấy danh sách user", error);
  }
};



export const addUserActionAsync = (formData) => async (dispatch) => {
  try {
    const res = await http.post("/v1/user", formData);
    const newUser = res.data.data;
    dispatch(addUserAction(newUser));
    message.success("Thêm thành công");
    return newUser;
  } catch (error) {
    console.error("Lỗi khi thêm user:");
  }
};

export const updateUserActionAsync = (formData) => async (dispatch) => {
  try {
    await http.put("/v1/user", formData);
    dispatch(updateUserAction(formData));
    message.success("Cập nhật thành công");
  } catch (error) {
    message.error("Cập nhật thất bại!");
  }
};

export const deleteUserActionAsync = (userID) => async (dispatch) => {
  try {
    await http.delete(`/v1/user/${userID}`);
    dispatch(deleteUserAction(userID));
    message.success("Xóa thành công");
  } catch (error) {
    message.error("Xóa thất bại!");
  }
};

export const updateUserActiveActionAsync = (userID, newActive) => async (dispatch) => {
  try {
    await http.patch(`/v1/user.active/${userID}`, { active: newActive });
    dispatch(updateUserActiveAction({ userID, newActive }));
    message.success("Cập nhật trạng thái thành công!");
  } catch (error) {
    message.error("Cập nhật trạng thái thất bại!");
  }
};

export const deleteListActionAsync = (listId) => async (dispatch) => {
  try {
    await http.delete(`/v1/users`, { data: listId });
    dispatch(deleteUsersAction(listId));
    message.success("Xóa danh sách người dùng thành công!");
  } catch (error) {
    console.error(`Lỗi request: ${error.response?.data}`);
  }
};


