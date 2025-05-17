import { Card, Collapse } from "antd";
import { formatDateTime } from "../../../utils/formatDateTime";
import ActivityLogs from "../profile/ActivityLogs";
import CardProfileImage from "../profile/CardProfileImage";

const UserDetailForm = ({ record }) => (
  <>
    <div className="row justify-content-center">
      <div className="col-md-6 ">
        <Card
          hoverable
          cover={<CardProfileImage userInfo={record} editable={false} />}
        />
      </div>
      <div className="col-md-6 d-flex align-items-center justify-content-center">
        <Card title="Thông tin chi tiết" className="w-100">
          <div className="d-flex justify-content-between mb-2">
            <strong>Address:</strong>
            <span>{record?.address || "Not available"}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <strong>Phone:</strong>
            <span>{record?.phone || "Not available"}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <strong>Join date:</strong>
            {record?.createdAt
              ? formatDateTime(record?.createdAt)
              : "Not available"}
          </div>
          <div className="d-flex justify-content-between mb-2">
            <strong>Bio:</strong>
            <span>{record?.bio || "Not available"}</span>
          </div>
        </Card>
      </div>
      <div className="col-md-6">
      <Card>
        <Collapse
        defaultActiveKey={["0"]}
        ghost
        items={[
          {
            key: "1",
            label: "Hoạt động gần đây",
            children: <ActivityLogs userId={record.id} showTitle={false} showCard={false}/>,
          },
        ]}
        />
      </Card>
      </div>     
    </div>
  </>
);

export default UserDetailForm;
