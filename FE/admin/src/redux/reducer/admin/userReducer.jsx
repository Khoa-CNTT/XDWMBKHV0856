import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import { http } from "../../../setting/setting";

const initialState = {
  userApi: [],
  meta: {
    page: 1,
    size: 20,
    totalPage: 0,
    totalElement: 0,
  },
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
      state.userApi = state.userApi.map((user) =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      );
    },
    deleteUserAction: (state, action) => {
      state.userApi = state.userApi.filter(
        (user) => user.id !== action.payload
      );
    },
    deleteUsersAction: (state, action) => {
      const ids = action.payload;
      state.userApi = state.userApi.filter((user) => !ids.includes(user.id));
    },
    updateUserActiveAction: (state, action) => {
      const { userID, newActive } = action.payload;
      state.userApi = state.userApi.map((user) =>
        user.id === userID ? { ...user, active: newActive } : user
      );
    },
  },
});

export const {
  setAllUserAction,
  addUserAction,
  updateUserAction,
  deleteUserAction,
  deleteUsersAction,
  updateUserActiveAction,
} = userSlice.actions;
export default userSlice.reducer;

export const getAllUserActionAsync =
  ({ page = 1, size = 20, filters }) =>
  async (dispatch) => {
    try {
      let filterParams = "";

      if (filters.fullName && filters.email) {
        const searchText = filters.fullName;
        filterParams += `filter=fullName~'${searchText}' or email~'${searchText}'`;
      } else {
        filterParams = Object.entries(filters || {})
          .filter(
            ([_, value]) =>
              value !== null && value !== undefined && value !== ""
          )
          .flatMap(([key, value]) => {
            if (Array.isArray(value)) {
              // role~'ADMIN' or role~'ROOT'
              return [
                `filter=${value.map((v) => `${key}~'${v}'`).join(" or ")}`,
              ];
            } else {
              return [`filter=${key}~'${value}'`];
            }
          })
          .join("&");
      }

      const queryString = `?page=${page}&size=${size}${
        filterParams ? `&${filterParams}` : ""
      }`;

      const res = await http.get(`/v1/users${queryString}`);
      const result = res.data?.data?.result || [];
      const meta = res.data?.data?.meta || {};
      dispatch(setAllUserAction({ result, meta }));
    } catch (error) {
      console.error(`Error fetching user list ${error}`);
    }
  };

export const addUserActionAsync = (formData) => async (dispatch) => {
  try {
    const res = await http.post("/v1/user", formData);
    const newUser = res.data.data;
    dispatch(addUserAction(newUser));
    message.success("Added successfully");
    return newUser;
  } catch (error) {
    console.error(`Error while adding user ${error}`);
  }
};

export const updateUserActionAsync = (formData) => async (dispatch) => {
  try {
    await http.put("/v1/user", formData);
    dispatch(updateUserAction(formData));
    message.success("Update successful");
  } catch (error) {
    message.error("Update failed!");
  }
};

export const deleteUserActionAsync = (userID) => async (dispatch) => {
  try {
    await http.delete(`/v1/user/${userID}`);
    dispatch(deleteUserAction(userID));
    message.success("deleted successfully");
  } catch (error) {
    message.error("Failed to delete!");
  }
};

export const updateUserActiveActionAsync =
  (userID, newActive) => async (dispatch) => {
    try {
      await http.patch(`/v1/user.active/${userID}`, { active: newActive });
      dispatch(updateUserActiveAction({ userID, newActive }));
      message.success("Status updated successfully!");
    } catch (error) {
      message.error(`Status update failed! ${error}`);
    }
  };

export const deleteListActionAsync = (listId) => async (dispatch) => {
  try {
    await http.delete(`/v1/users`, { data: listId });
    dispatch(deleteUsersAction(listId));
    message.success("User list deleted successfully!");
  } catch (error) {
    console.error(`Lỗi request: ${error.response?.data}`);
  }
};
