import { createSlice } from '@reduxjs/toolkit';
import { message } from "antd";
import { http } from '../../../setting/setting';
const initialState = {
  apiField: [],
  apiSkill: []
}

const studyReducer = createSlice({
  name: "studyReducer",
  initialState,
  reducers: {
    setAllFieldAction: (state, action) => {
      state.apiField = Array.isArray(action.payload) ? action.payload : [];
    },
    setAllSkillAction: (state, action) => {
      state.apiSkill = Array.isArray(action.payload) ? action.payload : [];
    },
  }
});

export const { setAllFieldAction,setAllSkillAction } = studyReducer.actions

export default studyReducer.reducer

export const getAllFieldActionAsync = () => {
  return async (dispatch) => {
    try {
      const response = await http.get("/v1/fields");
      const fields = response.data?.data?.result || [];
      dispatch(setAllFieldAction(fields));
    } catch (error) {
      message.error("Lỗi khi lấy danh sách fields:", error);
    }
  };
};

export const addFieldActionAsync = (fieldName) => {
  return async (dispatch, getState) => {
    try {
      const response = await http.post("/v1/field", fieldName)
      const newField = await response.data.data
      const currentApifield = getState().studyReducer.apiField
      dispatch(setAllFieldAction([newField, ...currentApifield]))
      message.success("Thêm field thành công")
    } catch (error) {
      console.log(fieldName)
      message.error(`${error.response.data.message}`)

    }
  }
}
export const updateFieldActionAsync = (fieldId, fieldName) => {
  return async (dispatch, getState) => {
    try {
      const updatedField = {
        id: fieldId,
        name: fieldName
      };

      const response = await http.put(`/v1/field`, updatedField);

      if (response.status === 200) {
        message.success("Cập nhật thành công!");

        // Lấy danh sách fields mới từ Redux Store
        const currentApiField = getState().studyReducer.apiField;

        // Tạo danh sách mới với field được cập nhật
        const updatedFields = currentApiField.map((field) =>
          field.id === fieldId ? { ...field, name: fieldName } : field
        );

        dispatch(setAllFieldAction(updatedFields));
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Cập nhật thất bại!");
    }
  };
};

export const deleteFieldActionAsync = (fieldId) => {
  return async (dispatch, getState) => {
    try {
      await http.delete(`/v1/field/${fieldId}`)
      const currentApiField = getState().studyReducer.apiField
      const updatedFields = currentApiField.filter((field) =>
        field.id !== fieldId
      )
      dispatch(setAllFieldAction(updatedFields))
      message.success(`Xóa Field thành công`);
    } catch (error) {
      message.error("Xóa thất bại!");
    }
  }
}


// ---------------SKill------------------
export const getAllSkillActionAsync = () => {
  return async (dispatch) => {
    try {
      const response = await http.get("/v1/skills");
      const skill = response.data?.data?.result || [];
      dispatch(setAllSkillAction(skill));
    } catch (error) {
      message.error("Lỗi khi lấy danh sách skill:", error);
    }
  };
}

export const addSkillActionAsync = (newSkill) => {
  return async(dispatch,getState) => {
    try {
      const formSkill = {
        name: newSkill.name,
        field : {
          id: newSkill.id
        }
      }
      const res = await http.post("/v1/skill", formSkill)
      const newSkillData = res.data.data; 
      const currentApiSkill = getState().studyReducer.apiSkill
      dispatch(setAllSkillAction([newSkillData,...currentApiSkill]))
      message.success("Thêm kỹ năng thành công")
    } catch (error) {
      message.error(`${error.response.data.message}`)
      
    }
  }
}

export const updateSkillActionAsync = (formUpdate) => {
  return async(dispatch,getState) => {
    try {
      const formSkill = {
        name: formUpdate.name,
        id: formUpdate.id
      }
      await http.put("/v1/skill",formSkill)
      const currentApiSkill = getState().studyReducer.apiSkill
      const updateSkill = currentApiSkill.map((skill) =>
  skill.id === formSkill.id ? { ...skill, name: formUpdate.name } : skill
);
      dispatch(setAllSkillAction(updateSkill))
      message.success("Cập nhật kỹ năng thành công")
    } catch (error) {
      message.error(`${error.response.data.message}`)
      
    }
  }
}

export const deleteSkillActionAsync = (id) => {
  return async(dispatch,getState) => {
    try {
      await http.delete(`/v1/skill/${id}`)
      const currentApiSkill = getState().studyReducer.apiSkill
      const updateSkill = currentApiSkill.filter(skill => skill.id !== id)
      dispatch(setAllSkillAction(updateSkill))
      message.success("Xóa kỹ năng thành công")
    } catch (error) {
      message.error(`${error.response.data.message}`)
    }
  }
}

export const searchFieldActionAsync = (searchValue) => {
  return async (dispatch) => {
    try {
      let url = "/v1/fields";
      if (searchValue.trim() !== "") {
        url = `/v1/fields?filter=name~'${searchValue}'`;
      }

      const response = await http.get(url);
      const filteredFields = response.data?.data?.result || [];

      dispatch(setAllFieldAction(filteredFields));
    } catch (error) {
      message.error("Lỗi khi tìm kiếm fields:", error);
    }
  };
};

export const searchSkillActionAsync = (searchValue) => {
  return async (dispatch) => {
    try {
      let url = "/v1/skills";
      if (searchValue.trim() !== "") {
        if (!isNaN(searchValue)) {
          // Nếu searchValue là số, lọc theo field.id
          url = `/v1/skills?filter=field.id:'${searchValue}'`;
        } else {
          // Nếu là chuỗi, lọc theo name
          url = `/v1/skills?filter=name~'${searchValue}'`;
        }
      }

      const response = await http.get(url);
      const filteredSkills = response.data?.data?.result || [];

      dispatch(setAllSkillAction(filteredSkills));
    } catch (error) {
      message.error("Lỗi khi tìm kiếm skills:", error);
    }
  };
};



export const searchFieldBySkillActionAsync = (searchSkill) => {
  return async (dispatch) => {
    try {
      let url = `/v1/fields?filter=skills.name~'${searchSkill}'`; // Lọc Field có chứa Skill

      const response = await http.get(url);
      const filteredFields = response.data?.data?.result || [];

      dispatch(setAllFieldAction(filteredFields)); // Cập nhật danh sách Field
    } catch (error) {
      message.error("Lỗi khi tìm kiếm Field theo Skill:", error);
    }
  };
};

