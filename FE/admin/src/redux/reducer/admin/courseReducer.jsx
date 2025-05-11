import { createSlice } from '@reduxjs/toolkit';
import { message } from "antd";
import { http } from '../../../setting/setting';

const initialState = {
  apiCourse : [],
  detailCourse: {}
}

const courseReducer = createSlice({
  name: "courseReducer",
  initialState,
  reducers: {
    setAllCourseAction: (state, action) => {
      state.apiCourse =action.payload;
    },
    setAddCourseAction: (state, action) => {
      if (!Array.isArray(state.apiCourse)) {
        state.apiCourse = []; 
      }
      state.apiCourse.push(action.payload);
    },
    setUpdateCourseAction: (state, action) => {
      const updatedCourse = action.payload;
      const index = state.apiCourse.findIndex(course => course.id === updatedCourse.id);
      if (index !== -1) {
        state.apiCourse[index] = updatedCourse; 
      }
    },
    setDeleteCourseAction: (state, action) => {
      state.apiCourse = state.apiCourse.filter(course => course.id !== action.payload)
    },
    setImageCourseAction: (state, action) => {
      const { id, imageUrl } = action.payload;
      const index = state.apiCourse.findIndex(course => course.id === id);
      if (index !== -1) {
        state.apiCourse[index].image = imageUrl; 
      }
    },
    setDetailCourseAction: (state,action) => {
      state.detailCourse = action.payload;
    }
},
    
});

export const {setAllCourseAction,setAddCourseAction,setDeleteCourseAction,setUpdateCourseAction,setImageCourseAction, setDetailCourseAction} = courseReducer.actions

export default courseReducer.reducer

export const getAllCourseActionAsync = () => {
  return async(dispatch) => {
    try {
    const res = await http.get("/v1/courses")
    const apiCourse = res.data?.data?.result || [];
    dispatch(setAllCourseAction(apiCourse));
    } catch (error) {
      message.error(`Error fetching list of Courses ${error}`);
    }
  }
}

export const addCourseActionAsync = (formData) => {
  return async (dispatch) => {
    try {
      const newData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        owner: { id: formData.ownerID }, 
        fields: formData.field?.map((item) => ({ id: item.id })) || [],
        skills: formData.skill?.map((item) => ({ id: item.id })) || [],
      };

      const res = await http.post("/v1/course", newData);
      if (res.status === 201) {
        message.success("Course added successfully!");
        dispatch(setAddCourseAction(res.data.data));
      }
    } catch (error) {
      console.log(error);
      message.error(`Error adding course: ${error?.response?.data?.message || error.message}`);
    }
  };
};

export const approveCourseActionAsync = (id,status) => {
  return async(dispatch) => {
    try {
      const updatePayload = {
        id: id,
        status: status
      }
      const res = await http.patch(`/v1/course.status`,updatePayload)
      if (res.status === 200) {
        message.success("Course updated successfully!");
        dispatch(setUpdateCourseAction(res.data.data)); 
      }
    } catch (error) {
      message.error(`Error while approving the course: ${error?.response?.data?.message || error.message}`);
    }
  }
}

export const updateCourseActionAsync = (formData) => {
  return async (dispatch) => {
    try {
      const updatePayload = {
        id: formData.id,
        title: formData.title,
        description: formData.description,
        price: formData.price,
        fields: formData.fields.map(field => ({ id: field.value })),
        skills: formData.skills.map(skill => ({ id: skill.value })),
        status: formData.status
      };

      const res = await http.put(`/v1/course`, updatePayload);

      if (res.status === 200) {
        message.success("Course updated successfully!");
        dispatch(setUpdateCourseAction(res.data.data)); 
      }
    } catch (error) {
      message.error(`Error updating course: ${error?.response?.data?.message || error.message}`);
    }
  };
};

export const deleteCourseActionAsync = (id) => {
  return async (dispatch) => {
    try {
      const res = await http.delete(`/v1/course/${id}`);

      if (res.status === 200) {
        message.success("Course deleted successfully!");
        dispatch(setDeleteCourseAction(id)); 
      }
    } catch (error) {
      console.log(error)
      message.error(`Error when deleting course: ${error?.response?.data?.message || error.message}`);
    }
  };
};

export const uploadCourseImageActionAsync = (file, id) => {
  return async (dispatch) => {
    
    try {
      const formData = new FormData(); 
      formData.append("file", file); 

      const res = await http.patch(`/v1/course.image/${id}`, formData);

      if (res.status === 200) {
        message.success("Image uploaded successfully!");
        dispatch(setImageCourseAction({ id, imageUrl: res.data.data.image }));
      }
    } catch (error) {
      console.log(error);
      message.error("Error uploading image:", error);
    }
  };
};


export const getDetailCourseActionAsync = (id) => {
  return async(dispatch) => {
    const res = await http.get(`/v1/course-details/${id}`)
    const apiCourse = res.data?.data
    dispatch(setDetailCourseAction(apiCourse))
  }
}