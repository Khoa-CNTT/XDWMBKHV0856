import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import { http } from "../../../setting/setting";

const initialState = {
  userApi: []
};

const userSlice = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    setAddUserAction: (state, action) => {
      state.userApi = action.payload;
    },
    setAllUserAction: (state,action) => {
      state.userApi = Array.isArray(action.payload) ? action.payload : [];
    },

  },
});

export const { setAddUserAction ,setAllUserAction,setUpdateUserAction} = userSlice.actions;
export default userSlice.reducer;

export const getAllUserActionAsync = () => {
  return async (dispatch) => {
    try {
      const response = await http.get("/v1/users");
      const users = response.data?.data?.result || [];
      dispatch(setAllUserAction(users));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách user:", error);
    }
  };
};

export const addUserActionAsync = (formData) => {
  return async (dispatch, getState) => {
    try {
      const res = await http.post("/v1/user", formData);
      const newUser = res.data.data;

      // Lấy danh sách user hiện tại từ store
      const currentUsers = getState().userReducer.userApi;

      // Cập nhật danh sách user bằng cách thêm user mới vào mảng
      dispatch(setAllUserAction([newUser, ...currentUsers]));
      message.success("Thêm thành công")
      return newUser;
    } catch (error) {
      console.error("Lỗi khi thêm user:", error);
    }
  };
};

// export const addUserActionAsync = (formData, fileDataRef) => {
//   return async (dispatch, getState) => {
//     try {
//       const res = await http.post("/v1/user", formData);
//       const newUser = res.data.data;

//       console.log("Dữ liệu file gửi đi:", fileDataRef);

//         const uploadFormData = new FormData();
//         uploadFormData.append("file", fileDataRef.file); 
//         uploadFormData.append("entity", fileDataRef.entityType);
//         uploadFormData.append("id", newUser.id);

//         await http.post("/v1/file/upload", uploadFormData);

//       const currentUsers = getState().userReducer.userApi;
//       dispatch(setAllUserAction([newUser, ...currentUsers]));

//       message.success("Tạo user và upload ảnh thành công!");
//       return newUser;
//     } catch (error) {
//       console.error("Lỗi khi thêm user:", error);
//       message.error("Có lỗi xảy ra, vui lòng thử lại!");
//     }
//   };
// };

export const updateUserActionAsync = (formData) => {
  return async (dispatch, getState) => {
    try {
      await http.put("/v1/user", formData);
      const currentUsers = getState().userReducer.userApi;
      const updatedUsers = currentUsers.map((user) =>
        user.id === formData.id ? { ...user, ...formData } : user
      );

      dispatch(setAllUserAction(updatedUsers));
      message.success("Cập nhật thành công");
    } catch (error) {
      message.error("Cập nhật thất bại!");
      return;
    }
  };
};


export const deleteUserActionAsync = (userID) => {
  return async (dispatch, getState) => {
    try {
      await http.delete(`/v1/user/${userID}`)
      const currentUsers = getState().userReducer.userApi
      const updateUsers = currentUsers.filter((user) => 
        user.id !== userID
      )
      dispatch(setAllUserAction(updateUsers)) 
      message.success(`Xóa thành người dùng thành công`);
    } catch (error) {
      message.error("Xóa thất bại!");
      return;
    }
  }
}


export const updateUserActiveActionAsync = (userID, newActive) => {
  return async (dispatch, getState) => {
    try {
      const response = await http.patch(`/v1/user.active/${userID}`, { active: newActive });

      if (response.status === 200) {
        const currentUsers = getState().userReducer.userApi;
        const updatedUsers = currentUsers.map(user =>
          user.id === userID ? { ...user, active: newActive } : user
        );

        dispatch(setAllUserAction(updatedUsers));
        message.success("Cập nhật trạng thái thành công!");
      }
    } catch (error) {
      message.error("Cập nhật trạng thái thất bại!");
    }
  };
};

export const deleteListActionAsync = (listId) => {
  return async (dispatch, getState) => {
    console.log(listId)
    try {
      await http.delete(`/v1/users`, {data: listId}); 

      const currentUsers = getState().userReducer.userApi;
      const updatedUsers = currentUsers.filter(user => !listId.includes(user.id)); 

      dispatch(setAllUserAction(updatedUsers));
      message.success("Xóa danh sách người dùng thành công!");
    } catch (error) {
      console.error("Lỗi request:", error.response?.data || error.message);
    }
  };
};

