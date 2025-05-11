import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { Button, Card, Form, Input, List, Modal, Row, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useLoading from "../../../hooks/useLoading";
import { addFieldActionAsync, addSkillActionAsync, deleteFieldActionAsync, deleteSkillActionAsync, getAllFieldActionAsync, updateFieldActionAsync, updateSkillActionAsync, } from "../../../redux/reducer/admin/studyReducer";
const { Option } = Select;

const StudyManagement = () => {
  const { loading, startLoading, stopLoading } = useLoading();
  const [fieldForm] = Form.useForm();
  const [skillForm] = Form.useForm();

  const [selectedSkills, setSelectedSkills] = useState({});

  const dispatch = useDispatch();

  const [modalAction, setModalAction] = useState("");

  //---------------------------------------FIELD-----------------------------------------------------
  const [searchField, setSearchField] = useState("");

  // Hàm đóng modal Field
  const handleFieldModalCancel = () => {
    fieldForm.resetFields();
    setIsFieldModalOpen(false);
  };
  //Dữ liệu Field
  const fields = useSelector((state) => state.studyReducer.apiField);
  //Modal Field
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  //Hàm show Modal Field
  const showFieldModal = (type, field = null) => {
    setModalAction(type);
    setIsFieldModalOpen(true);

    if ((type === "Edit" || type === "Delete") && field) {
      fieldForm.setFieldsValue({
        fieldId: field.id || "",
        fieldName: field.name || "",
      });
    } else {
      fieldForm.resetFields();
    }   
  };

  //Form Field Add
  const renderFieldFormAdd = () => {
    return (
      <>
        <Form.Item
          label="Field Name"
          name="fieldName"
          rules={[{ required: true, message: "Please enter the field name!" }]}
        >
          <Input placeholder="Enter field name" />
        </Form.Item>
      </>
    );
  };
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
          label="Field Name"
          name="fieldName"
          rules={[{ required: true, message: "Please enter the field name!" }]}
        >
          <Input placeholder="Enter field name" />
        </Form.Item>
      </>
    );
  };
  //Form field delete
  const renderFieldFormDelete = () => {
    return (
      <div>
        <p>
          `Are you sure you want to delete the field "$
          {fieldForm.getFieldValue("fieldName")}"?`
        </p>
      </div>
    );
  };

  //Hàm thêm Field
  const handleOkField = async () => {
    const values = await fieldForm.validateFields();
    if (modalAction === "Add") {
      const name = { name: values.fieldName };
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
  };
  // ----------------------------------------Skill --------------------------------------------------
  const [searchSkill, setSearchSkill] = useState("");
  //Xem kỹ năng của từng field
  const [isViewAllSkillsModalOpen, setIsViewAllSkillsModalOpen] = useState(false);
  const [selectedFieldSkills, setSelectedFieldSkills] = useState([]);
  const [selectedFieldName, setSelectedFieldName] = useState("");
  const handleViewAllSkills = (field) => {
    const views = getSkillsByField(field.id) || [];
    setSelectedFieldSkills(views);
    setSelectedFieldName(field.name);
    setIsViewAllSkillsModalOpen(true);
  };

  //Dữ liệu kỹ năng
  const skills = useSelector((state) => state.studyReducer.apiSkill);

  //Modal Skill
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  //ham đóng modal skill
  const handleSkillModalCancel = () => {
    skillForm.resetFields();
    setIsSkillModalOpen(false);
  };

  //hàm lấy skill theo field
  const getSkillsByField = (fieldId) => {
    return skills.filter((skill) => skill.field?.id === fieldId);
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
      const updateSkill = { name: values.skillName, id: values.skillId };
      await dispatch(updateSkillActionAsync(updateSkill));
    } else if (modalAction === "Delete") {
      const idDelete = selectedSkills.id;
      await dispatch(deleteSkillActionAsync(idDelete));
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
            label="Skill Name"
            name="skillName"
            rules={[
              { required: true, message: "Please enter the skill name!" },
            ]}
          >
            <Input placeholder="Enter skill name" />
          </Form.Item>
        </>
      );
    } else if (modalAction === "Edit") {
      return (
        <>
          <Form.Item name="skillId" label="Skill ID">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Skill Name"
            name="skillName"
            rules={[
              { required: true, message: "Please enter the skill name!" },
            ]}
          >
            <Input placeholder="Enter skill name" />
          </Form.Item>
        </>
      );
    } else if (modalAction === "Delete") {
      return (
        <p>
          Are you sure you want to delete the skill{" "}
  <strong>{selectedSkills?.name}</strong>?
        </p>
      );
    }
  };

  // Hàm lọc dũ liệu FIELD VÀ SKILL
  // Lọc danh sách Skill theo tên và thuộc fieldId
  const getFilteredSkillsByField = (fieldId) => {
    return skills.filter(
      (skill) =>
        skill.field?.id === fieldId &&
        skill.name.toLowerCase().includes(searchSkill.toLowerCase())
    );
  };

  const filteredFields = searchField.trim()
    ? fields.filter((field) => {
        const fieldMatch = field.name
          .toLowerCase()
          .includes(searchField.toLowerCase());
        const skillMatch = getFilteredSkillsByField(field.id).length > 0;
        return fieldMatch && skillMatch;
      })
    : fields; // Khi không tìm kiếm, hiển thị tất cả fields

  useEffect(() => {
    if (fields.length === 0 || skills.length === 0) {
      const fetchData = async () => {
        try {
          startLoading();
          await Promise.all([dispatch(getAllFieldActionAsync())]);
        } finally {
          stopLoading();
        }
      };
      fetchData();
    }
  }, [dispatch, startLoading, stopLoading]);

  return (
    <>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <Spin />
        </div>
      ) : (
        <div>
          <div className="d-flex justify-content-between align-items-center w-100 p-4 bg-white shadow-sm rounded-lg">
            {/* Các nút chức năng nằm bên trái */}
            <div className="d-flex gap-3">
              <Button type="primary" onClick={() => showFieldModal("Add")}>
                Add Field
              </Button>
              <Button type="primary" onClick={() => showSkillModal("Add")}>
                Add Skill
              </Button>
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

          </div>
          <List
            pagination={{ pageSize: 4 }}
            className="mt-5"
            grid={{ gutter: 16, column: 2 }}
            dataSource={filteredFields}
            renderItem={(field) => {
              const skills = getFilteredSkillsByField(field.id);

              return (
                <List.Item key={field.id}>
                  <Card
                    title={
                      <Row className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                         
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
                    }
                  >
                    

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
                              
                              <span>{skill.name}</span>
                            </div>
                            <div className="button-action-skill">
                              <Button
                                type="text"
                                size="small"
                                className="skill-btn"
                                onClick={() =>
                                  showSkillModal("Edit", {
                                    id: skill.id,
                                    name: skill.name,
                                  })
                                }
                              >
                                <EditFilled />
                              </Button>
                              <Button
                                type="text"
                                size="small"
                                className="skill-btn"
                                onClick={() =>
                                  showSkillModal("Delete", {
                                    id: skill.id,
                                    name: skill.name,
                                  })
                                }
                              >
                                <DeleteFilled />
                              </Button>
                            </div>
                          </div>
                        </List.Item>
                      )}
                    />

                    <Button
                      type="link"
                      onClick={() => showSkillModal("Add", field)}
                    >
                      Add skill
                    </Button>
                    <Button
                      type="link"
                      danger
                      onClick={() => handleViewAllSkills(field)}
                    >
                      View all 
                    </Button>
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
              {modalAction === "Edit"
                ? renderFieldFormEdit()
                : modalAction === "Delete"
                ? renderFieldFormDelete()
                : renderFieldFormAdd()}
            </Form>
          </Modal>
          {/* Modal Skill  */}
          <Modal
            title={
              modalAction === "Add"
                ? "ADD SKILL"
                : modalAction === "Edit"
                ? "EDIT SKILL"
                : "DELETE SKILL"
            }
            open={isSkillModalOpen}
            onCancel={handleSkillModalCancel}
            getContainer={false}
            onOk={handleOkSkill}
          >
            <Form form={skillForm} layout="vertical">
              {renderSkillForm()}
            </Form>
          </Modal>
          ;{/* Modal xem tất cả skill  */}
          <Modal
            title={`LIST SKILL OF ${selectedFieldName}`}
            open={isViewAllSkillsModalOpen}
            onCancel={() => setIsViewAllSkillsModalOpen(false)}
            footer={null}
          >
            <List
              dataSource={selectedFieldSkills}
              renderItem={(skill) => (
                <List.Item key={skill.id}>{skill.name}</List.Item>
              )}
            />
          </Modal>
        </div>
      )}
    </>
  );
};

export default StudyManagement;
