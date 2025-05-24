import { Button, Checkbox, Input, message, Modal, Steps, Table } from "antd";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetailActionAsync } from "../../../redux/reducer/admin/userReducer";
import { http } from "../../../setting/setting";
import UserSelector from "./UserSelector";

const { Step } = Steps;

const CreateOrderModal = ({ open, setOpenOrderModal, apiCourse}) => {

  const [step, setStep] = useState(0);
  const dispatch = useDispatch()
  const {userDetail} = useSelector(state => state.userReducer) || {}
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [searchText, setSearchText] = useState("");
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    if (user && user.id) {
      dispatch(getUserDetailActionAsync(user.id));
    }
  };
   const onClose = () => {
    setSelectedUser(null);
    setSelectedCourses([]);
    setSearchText("");
    setStep(0);
    setOpenOrderModal(false)
   }

  const handleCourseCheck = (checked, courseId) => {
    setSelectedCourses((prev) =>
      checked ? [...prev, courseId] : prev.filter((id) => id !== courseId)
    );
  };

  const filteredCourses = useMemo(() => {
    if (!userDetail) return [];
    const titleIncludes = (title, search) =>
      (title?.toLowerCase().trim() || "").includes(search.toLowerCase().trim());
  
    const ownedCourseIds = userDetail.ownCourses?.map((c) => c.id) || [];
    const boughtCourseIds = userDetail.boughtCourses?.map((c) => c.id) || [];
  
    return apiCourse?.filter((course) => {
      const isOwnedOrBought =
        ownedCourseIds.includes(course.id) ||
        boughtCourseIds.includes(course.id) || 
        course.active === false
  
      return (
        course.status === "APPROVED" &&
        titleIncludes(course.title, searchText) &&
        !isOwnedOrBought
      );
    }) || [];
  }, [apiCourse, userDetail, searchText]);
  

  const handleOk = () => {
    if (!selectedUser || selectedCourses.length === 0) {
      message.error("Chọn user và ít nhất 1 course");
      return;
    }

    const selectedCourseTitles = apiCourse
      ?.filter((course) => selectedCourses.includes(course.id))
      .map((course) => `- ${course.title} (${course.price} VND)`)
      .join("\n");

    Modal.confirm({
      title: "Xác nhận tạo Order?",
      content: (
        <div>
          <p>
            <strong>User:</strong> {selectedUser.fullName}
          </p>
          <p>
            <strong>Courses:</strong>
          </p>
          <pre style={{ margin: 0 }}>{selectedCourseTitles}</pre>
        </div>
      ),
      onOk: async() => {

        try {
          await http.post(`/v1/order`, {
            buyer: {
              id: selectedUser.id
            },
            courses: selectedCourses.map(id => ({ id }))
          });
        message.success("Tạo Order thành công!");
        dispatch(getUserDetailActionAsync(selectedUser.id))
        setSelectedUser(null);
        setSelectedCourses([]);
        setSearchText("");
        setStep(0);
        onClose();
        } catch (error) {
          message.error(`Error: ${error}`)
        }
      },
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Create Order"
      width={800}
      footer={[
        step > 0 && (
          <Button key="back" onClick={() => setStep(step - 1)}>
            Quay lại
          </Button>
        ),
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
        key="next"
        type="primary"
        onClick={() => {
          if (step === 0) {
            if (!selectedUser || !userDetail?.id) {
              message.warning("Vui lòng chọn user");
              return;
            }
            setStep(1);
          } else {
            handleOk();
          }
        }}
      >
        {step === 1 ? "Xác nhận" : "Tiếp tục"}
      </Button>
      ]}
    >
      <Steps current={step} size="small" className="mb-4">
        <Step title="Chọn User" />
        <Step title="Chọn Khóa học" />
      </Steps>

      {step === 0 && (
        <UserSelector
          selectedUser={selectedUser}
          onUserSelect={handleUserSelect}
        />
      )}

      {step === 1 && (
        <>
          <Input
            placeholder="Tìm khóa học..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ marginBottom: 16, width: 300 }}
          />
          <Table
            dataSource={filteredCourses}
            columns={[
              {
                title: "Chọn",
                dataIndex: "id",
                width:80,
                render: (id) => (
                  <Checkbox
                    checked={selectedCourses.includes(id)}
                    onChange={(e) => handleCourseCheck(e.target.checked, id)}
                  />
                ),
              },
              {
                title: "Image",
                dataIndex: "image",
                width: 100,
                render: (_,record) => {
                  const imageUrl = `http://localhost:8080/storage/course/${record.id}/${record.image}`
            
                  return (
                    <img
                      src={imageUrl}
                      alt="course"
                      style={{ width: 80, height: 50, objectFit: "cover", borderRadius: 4 }}
                    />
                  );
                },
              },
              {
                title: "Title",
                dataIndex: "title",
                width: "30%",
                ellipsis: true,
                render: (text) => <span title={text}>{text}</span>
              },
              {
                title: "Owner",
                dataIndex: ["owner", "email"],
                width: "45%",
                ellipsis: true,
                render: (text) => <span title={text}>{text}</span>
              }
              
            ]}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </>
      )}
    </Modal>
  );
};

export default CreateOrderModal;
