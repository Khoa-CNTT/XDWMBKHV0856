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

      const allSkills = fields.flatMap(field => {
        return (field.skills || []).map(skill => ({
          ...skill,
          field: {
            id: field.id,
            name: field.name
          }
        }));
      });
      

      dispatch(setAllSkillAction(allSkills));
    } catch (error) {
      message.error("Error fetching the list of fields and skills");
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
      message.success("Field added successfully")
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
        message.success("Update successful!");

        // Lấy danh sách fields mới từ Redux Store
        const currentApiField = getState().studyReducer.apiField;

        // Tạo danh sách mới với field được cập nhật
        const updatedFields = currentApiField.map((field) =>
          field.id === fieldId ? { ...field, name: fieldName } : field
        );

        dispatch(setAllFieldAction(updatedFields));
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Update failed!");
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
      message.success(`Field deleted successfully`);
    } catch (error) {
      message.error("Failed to delete!");
    }
  }
}


// ---------------SKill------------------

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
      message.success("Skill added successfully")
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
      message.success("Skill updated successfully")
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
      message.success("Skill deleted successfully")
    } catch (error) {
      message.error(`${error.response.data.message}`)
    }
  }
}
