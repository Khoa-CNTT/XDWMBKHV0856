import { createSlice } from '@reduxjs/toolkit';
import { message, notification } from 'antd';
import { http, navigateHistory, TOKEN } from '../../../setting/setting';

const initialState = {
  userInfo: null,     
};

const authReducer = createSlice({
  name: "authReducer",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    updateProfileAction: (state, action) => {
      const updatedProfile = action.payload;
      state.userInfo = { ...state.userInfo, ...updatedProfile };
    },
    setAvatarAction: (state, action) => {
      const { avatar } = action.payload;
      if (state.userInfo) {
        state.userInfo.avatar = avatar;
      }
    },
    setBackgroundAction: (state, action) => {
      const { background } = action.payload;
      if (state.userInfo) {
        state.userInfo.background = background;
      }
    }
    ,
    clearUserInfo: (state) => {
      state.userInfo = null;  
    }
    
  }
});

export const { setUserInfo, clearUserInfo,updateProfileAction,setAvatarAction,setBackgroundAction } = authReducer.actions;
export default authReducer.reducer;

export const loginActionAsync = (dataLogin) => {
  return async() => {
    try {
      // Gửi dữ liệu login
      const res = await http.post(`/v1/admin-login`, dataLogin);
      // Lấy token từ response
      const token = res.data?.data;
      localStorage.setItem(TOKEN, token);
      navigateHistory.push("/dashboard");
    } catch (error) {
      message.error("Incorrect email or password")
    }
  };
};

export const getAccountProfile = () => {
  return async (dispatch) => {
    try {
      const resAccount = await http.get('/v1/account');
      const basicUserInfo = resAccount.data?.data;
      
      if (basicUserInfo?.role !== 'ADMIN' && basicUserInfo?.role !== 'ROOT') {
        notification.error({
          message: 'Lỗi quyền truy cập',
          description: 'Không có quyền truy cập. Vai trò của bạn không hợp lệ.',
          duration: 3,
        });
        return;
      }

      // Sau đó lấy thông tin chi tiết bằng ID
      const resDetail = await http.get(`/v1/user/${basicUserInfo.id}`);
      const fullUserInfo = resDetail.data?.data;

      dispatch(setUserInfo(fullUserInfo));
    } catch (error) {
      message.error(error);
    }
  };
};

export const updateProfileActionAsync = (formData) => async (dispatch) => {
  try {
    await http.put("/v1/user", formData);
    dispatch(updateProfileAction(formData));
    message.success("Updated successfully");
  } catch (error) {
    console.log(error)
    message.error(`Failed to Update! ${error}`);
  }
};

export const uploadAvatarActionAsync = (file,id) => {
  return async(dispatch) => {
    try {
      const formData = new FormData();
      formData.append("file",file);
      const res = await http.patch(`/v1/user.avatar/${id}`,formData)
      if(res.status === 200){
        message.success("Upload success");
        dispatch(setAvatarAction({avatar: res.data.data.avatar }))
      }
    } catch (error) {
      message.error(`${ error}`);
    }
  }
} 
export const uploadBackgroundActionAsync = (file,id) => {
  return async(dispatch) => {
    try {
      const formData = new FormData();
      formData.append("file",file);
      console.log({file})
      const res = await http.patch(`/v1/user.background/${id}`,formData)
      if(res.status === 200){
        message.success("Upload success");
        dispatch(setBackgroundAction({background: res.data.data.background }))
      }
    } catch (error) {
      message.error(`${ error}`);
    }
  }
} 
export const logoutActionAsync = () => {
  return (dispatch) => {
    // Xóa token khỏi localStorage
    localStorage.removeItem(TOKEN);

    // Dispatch action để xóa userInfo khỏi Redux store
    dispatch(clearUserInfo());

    // Hiển thị thông báo logout thành công
    message.success("Successfully logged out!");

    // Chuyển hướng về trang login
    navigateHistory.replace("/login"); 
setTimeout(() => {
  window.location.reload(); 
}, 0);
  };
};







