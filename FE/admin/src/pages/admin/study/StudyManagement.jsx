import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input, List, Modal, Row, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useLoading from "../../../hooks/useLoading";
import { addFieldActionAsync, addSkillActionAsync, deleteFieldActionAsync, deleteSkillActionAsync, getAllFieldActionAsync, getAllSkillActionAsync, searchFieldActionAsync, searchFieldBySkillActionAsync, searchSkillActionAsync, updateFieldActionAsync, updateSkillActionAsync } from "../../../redux/reducer/admin/studyReducer";
const { Option } = Select;

const StudyManagement = () => {
  const { loading, startLoading, stopLoading } = useLoading();
  const [fieldForm] = Form.useForm();
  const [skillForm] = Form.useForm();
  const [selectedSkills, setSelectedSkills] = useState({});
  //Hàm kiểm tra checkbox
  const handleCheckboxChangeField = (name) => {
    setCheckedItemsField((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const dispatch = useDispatch()

  const [modalAction, setModalAction] = useState("");

  //---------------------------------------FIELD-----------------------------------------------------
  const [searchField, setSearchField] = useState("");

  // Hàm đóng modal Field
  const handleFieldModalCancel = () => {
    fieldForm.resetFields();
    setIsFieldModalOpen(false);
  };
  //Dữ liệu Field
  const fields = useSelector(state => state.studyReducer.apiField)
  const [checkedItemsField, setCheckedItemsField] = useState({});

  //Modal Field
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  //Hàm show Modal Field
  const showFieldModal = (type, field = null) => {
    setModalAction(type);
    setIsFieldModalOpen(true);

    if (type === "Edit" && field) {
      fieldForm.setFieldsValue({
        fieldId: field.id || "",
        fieldName: field.name || "",
      });
    }
    else if (type === "Delete" && field) {
      fieldForm.setFieldsValue({ fieldId: field.id || "", fieldName: field.name || "" })
    }
    else {
      fieldForm.resetFields();
    }
  };

  //Form Field Add
  const renderFieldFormAdd = () => {
    return <>
      <Form.Item
        label="Tên lĩnh vực"
        name="fieldName"
        rules={[{ required: true, message: "Vui lòng nhập tên lĩnh vực!" }]}
      >
        <Input placeholder="Nhập tên lĩnh vực" />
      </Form.Item>
    </>
  }
  //Form Field Edit
  const renderFieldFormEdit = () => {
    return (
      <>
        {/* Ô nhập ID (Chỉ đọc) */}
        <Form.Item label="ID lĩnh vực" name="fieldId">
          <Input disabled />
        </Form.Item>

        {/* Ô nhập tên lĩnh vực */}
        <Form.Item
          label="Tên lĩnh vực"
          name="fieldName"
          rules={[{ required: true, message: "Vui lòng nhập tên lĩnh vực!" }]}
        >
          <Input placeholder="Nhập tên lĩnh vực" />
        </Form.Item>
      </>
    );
  };
  //Form field delete
  const renderFieldFormDelete = () => {
    return (
      <div>
        <p>Bạn có chắc chắn muốn xóa Field "{fieldForm.getFieldValue("fieldName")}" này không?</p>
      </div>
    );
  };

  //Hàm thêm Field
  const handleOkField = async () => {
    const values = await fieldForm.validateFields();
    if (modalAction === "Add") {
      const name = { name: values.fieldName }
      await dispatch(addFieldActionAsync(name));
    } else if (modalAction === "Edit") {
      const fieldId = fieldForm.getFieldValue("fieldId");
      const fieldName = values.fieldName;
      await dispatch(updateFieldActionAsync(fieldId, fieldName));

    } else if (modalAction === "Delete") {
      const fieldId = fieldForm.getFieldValue("fieldId");
      await dispatch(deleteFieldActionAsync(fieldId));
    }
    fieldForm.resetFields();
    handleFieldModalCancel();
  }
  // ----------------------------------------Skill --------------------------------------------------
  const [searchSkill, setSearchSkill] = useState("");
  //Xem kỹ năng của từng field
  const [isViewAllSkillsModalOpen, setIsViewAllSkillsModalOpen] = useState(false);
  const [selectedFieldSkills, setSelectedFieldSkills] = useState([]);
  const [selectedFieldName, setSelectedFieldName] = useState("");
  const handleViewAllSkills = (field) => {
    const skills = getSkillsByField(field.id) || [];
    setSelectedFieldSkills(skills);
    setSelectedFieldName(field.name);
    setIsViewAllSkillsModalOpen(true);
  };

  //Dữ liệu kỹ năng
  const skills = useSelector(state => state.studyReducer.apiSkill)
  //Modal Skill
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  //ham đóng modal skill
  const handleSkillModalCancel = () => {
    skillForm.resetFields();
    setIsSkillModalOpen(false);
  };
  //Ham chọn skill
  const handleSkillSelect = (fieldId, skillId) => {
    setSelectedSkills((prev) => {
      const prevSelected = prev[fieldId] || [];
      return {
        ...prev,
        [fieldId]: prevSelected.includes(skillId)
          ? prevSelected.filter((id) => id !== skillId)
          : [...prevSelected, skillId],
      };
    });
  };
  //Hàm đánh dấu tất cả skill
  const handleSelectAll = (fieldId, skills) => {
    setSelectedSkills((prevSelected) => {
      const isAllSelected = (prevSelected[fieldId] || []).length === skills.length;

      return {
        ...prevSelected,
        [fieldId]: isAllSelected ? [] : skills.map(skill => skill.id),
      };
    });
  };

  //hàm lấy skill theo field
  const getSkillsByField = (fieldId) => {
    return skills?.filter((skill) => skill?.field?.id === fieldId) || [];
  };


  //Hàm show modal Skill

  const showSkillModal = (type, data = null) => {
    setModalAction(type);
    setIsSkillModalOpen(true);

    if (type === "Add") {
      skillForm.setFieldsValue({
        fieldId: data?.id,
        skillName: "",
      });
    } else if (type === "Edit") {
      skillForm.setFieldsValue({
        skillId: data?.id,
        skillName: data ? data.name : "",
      });
    } else if (type === "Delete") {
      setSelectedSkills(data);
    }
  };

  const handleOkSkill = async () => {
    const values = await skillForm.validateFields();
    if (modalAction === "Add") {
      const newSkill = { name: values.skillName, id: values.fieldId };
      await dispatch(addSkillActionAsync(newSkill));
    } else if (modalAction === "Edit") {
      const updateSkill = { name: values.skillName, id: values.skillId }
      await dispatch(updateSkillActionAsync(updateSkill))
    } else if (modalAction === "Delete") {
      const idDelete = selectedSkills.id
      await dispatch(deleteSkillActionAsync(idDelete))
    }
    skillForm.resetFields();
    handleSkillModalCancel();
  };


  const renderSkillForm = () => {
    if (modalAction === "Add") {
      return (
        <>
          <Form.Item name="fieldId" label="Field">
            <Select disabled={!!skillForm.getFieldValue("fieldId")}>
              {fields?.map((field) => (
                <Select.Option key={field.id} value={field.id}>
                  {field.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Tên kỹ năng"
            name="skillName"
            rules={[{ required: true, message: "Vui lòng nhập tên kỹ năng!" }]}
          >
            <Input placeholder="Nhập tên kỹ năng" />
          </Form.Item>
        </>
      );
    } else if (modalAction === "Edit") {
      return (
        <>
          <Form.Item name="skillId" label="Skill">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Tên kỹ năng"
            name="skillName"
            rules={[{ required: true, message: "Vui lòng nhập tên kỹ năng!" }]}
          >
            <Input placeholder="Nhập tên kỹ năng" />
          </Form.Item>
        </>
      );
    } else if (modalAction === "Delete") {
      return <p>Bạn có chắc chắn muốn xóa kỹ năng <strong>{selectedSkills?.name}</strong> không?</p>;
    }
  };


  useEffect(() => {
    startLoading()
    dispatch(getAllFieldActionAsync()).finally(stopLoading); // Lấy toàn bộ Fields
    startLoading()
    dispatch(getAllSkillActionAsync()).finally(stopLoading); // Lấy toàn bộ Skills
  }, [dispatch, startLoading, stopLoading]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchSkill.trim() !== "" && searchField.trim() !== "") {
        // Tìm kiếm cả Skill và Field đồng thời
        try {
          await Promise.all([
            dispatch(searchSkillActionAsync(searchSkill)),
            dispatch(searchFieldActionAsync(searchField))
          ]);
        } catch (error) {
          console.error("Có lỗi xảy ra khi tìm kiếm: ", error);
        }
      } else if (searchSkill.trim() !== "") {
        await dispatch(searchSkillActionAsync(searchSkill));
        await dispatch(searchFieldBySkillActionAsync(searchSkill)); // Tìm field có chứa skill
      } else if (searchField.trim() !== "") {
        await dispatch(searchFieldActionAsync(searchField));
      } else {
        dispatch(getAllFieldActionAsync());
        dispatch(getAllSkillActionAsync());
      }
    }, 500); // Debounce 500ms tránh gọi API liên tục

    return () => clearTimeout(delayDebounceFn);
  }, [searchField, searchSkill, dispatch]);


  return <>
    {loading ? <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spin />
      </div> : <div>
      <div className="d-flex justify-content-between align-items-center w-100 p-4 bg-white shadow-sm rounded-lg">
        {/* Các nút chức năng nằm bên trái */}
        <div className="d-flex gap-3">
          <Button type="primary" onClick={() => showFieldModal("Add")}>Add Field</Button>
          <Button type="primary" onClick={() => showSkillModal("Add")}>Add Skill</Button>
          <Input.Search
            placeholder="Tìm theo Field"
            allowClear
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="custom-width"
          />
          <Input.Search
            placeholder="Tìm theo Skill"
            allowClear
            value={searchSkill}
            onChange={(e) => setSearchSkill(e.target.value)}
            className="custom-width"
          />
        </div>

        {/* Nút Delete nằm bên phải */}
        {Object.values(checkedItemsField).some((value) => value) && (
          <Button
            type="text"
            className="fs-1 text-danger hover-text-red"
            style={{ cursor: "pointer" }}
          >
            <DeleteFilled />
          </Button>
        )}
      </div>


      <List
        pagination={{ pageSize: 4 }}
        className="mt-5"
        grid={{ gutter: 16, column: 2 }}
        dataSource={fields}
        renderItem={(field) => {
          const skills = getSkillsByField(field.id) || [];
          const isAllSelected = skills.length > 0 && (selectedSkills[field.id] || []).length === skills.length;

          return (
            <List.Item key={field.id}>
              <Card title={
                <Row className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  {/* Checkbox và Label */}
                  <Checkbox
                    className="me-2"
                    checked={checkedItemsField[field.name] || false}
                    onChange={() => handleCheckboxChangeField(field.name)}
                  />
                  <span>{field.name}</span>
                </div>
                {/* Các nút action */}
                <div className="d-flex">
                  <Button
                    type="text"
                    style={{ color: "orange" }}
                    onClick={() => showFieldModal("Edit", field)}
                  >
                    <EditFilled />
                  </Button>
                  <Button
                    type="text"
                    danger
                    onClick={() => showFieldModal("Delete", field)}
                  >
                    <DeleteFilled />
                  </Button>
                </div>
              </Row>
              }>
                {/* Checkbox "Chọn tất cả danh sách kỹ năng" */}
                <div className={`d-flex justify-content-between align-items-center ${skills.length === 0 ? 'hidden-section' : ''}`}>
                  <Checkbox
                    className="mb-2 p-2"
                    checked={isAllSelected}
                    indeterminate={
                      selectedSkills[field.id]?.length > 0 &&
                      selectedSkills[field.id]?.length < skills.length
                    }
                    onChange={() => handleSelectAll(field.id, skills)}
                  >
                    Chọn tất cả
                  </Checkbox>
                  {selectedSkills[field.id]?.length > 0 && (
                    <Button type="text" danger onClick={() => handleDeleteField(field.id)}>
                      <DeleteFilled />
                    </Button>
                  )}
                </div>

                {/* Danh sách kỹ năng */}
                <List
                  className="skill-list"
                  style={{ height: "200px", overflowY: "auto" }}
                  size="small"
                  dataSource={skills}
                  renderItem={(skill) => (
                    <List.Item key={skill.id}>
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <div className="check-text">
                          <Checkbox
                            className="me-2"
                            checked={selectedSkills[field.id]?.includes(skill.id)}
                            onChange={() => handleSkillSelect(field.id, skill.id)}
                          />
                          <span>{skill.name}</span>
                        </div>
                        <div className="button-action-skill">
                          <Button
                            type="text"
                            size="small"
                            className="skill-btn"
                            onClick={() => showSkillModal("Edit", { id: skill.id, name: skill.name })}
                          >
                            <EditFilled />
                          </Button>
                          <Button
                            type="text"
                            size="small"
                            className="skill-btn"
                            onClick={() => showSkillModal("Delete", { id: skill.id, name: skill.name })}
                          >
                            <DeleteFilled />
                          </Button>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />

                <Button type="link" onClick={() => showSkillModal("Add", field)}>Thêm Kỹ Năng</Button>
                <Button type="link" danger onClick={() => handleViewAllSkills(field)}>Xem tất cả kỹ năng</Button>
              </Card>
            </List.Item>
          );
        }}
      />
      {/* Modal field  */}
      <Modal
        title={`${modalAction} Field`}
        open={isFieldModalOpen}
        onCancel={handleFieldModalCancel}
        getContainer={false}
        onOk={handleOkField}
      >
        <Form form={fieldForm} layout="vertical">
          {modalAction === "Edit" ? renderFieldFormEdit()
            : modalAction === "Delete" ? renderFieldFormDelete()
              : renderFieldFormAdd()}
        </Form>
      </Modal>

      {/* Modal Skill  */}
      <Modal
        title={
          modalAction === "Add"
            ? "Thêm Kỹ năng"
            : modalAction === "Edit"
              ? "Chỉnh sửa Kỹ năng"
              : "Xóa Kỹ năng"
        }
        open={isSkillModalOpen}
        onCancel={handleSkillModalCancel}
        getContainer={false}
        onOk={handleOkSkill}
      >
        <Form form={skillForm} layout="vertical">
          {renderSkillForm()}
        </Form>
      </Modal>;

      {/* Modal xem tất cả skill  */}
      <Modal
        title={`Danh sách kỹ năng của ${selectedFieldName}`}
        open={isViewAllSkillsModalOpen}
        onCancel={() => setIsViewAllSkillsModalOpen(false)}
        footer={null}
      >
        <List
          dataSource={selectedFieldSkills}
          renderItem={(skill) => (
            <List.Item key={skill.id}>
              {skill.name}
            </List.Item>
          )}
        />
      </Modal>


    </div>}
  </>
};

export default StudyManagement;