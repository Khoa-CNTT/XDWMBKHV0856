import { Card, Pagination, Spin, Table, Tabs } from "antd";
import { useEffect, useState } from "react";
import { http } from "../../../setting/setting";
import { formatDateTime } from "../../../utils/formatDateTime";

const ActivityLogs = ({ userId, showTitle = true, showCard = true }) => {
  const [activeTab, setActiveTab] = useState("USER");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const fetchLogs = async (tab, page = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const res = await http.get(
        `/v1/logs?sort=id,desc&filter=user.id:'${userId}' and target:'${tab}'&page=${page}&size=${pageSize}`
      );
      const { result, meta } = res.data.data;
      setLogs(result);
      setPagination({
        current: meta.page,
        pageSize: meta.size,
        total: meta.totalElement,
      });
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchLogs(activeTab, pagination.current, pagination.pageSize);
      setPagination((prev) => ({
        ...prev,
        current: 1,
      }));
    }
  }, [activeTab, userId]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    fetchLogs(key, 1);
  };

  const handlePageChange = (page, pageSize) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
    }));
    fetchLogs(activeTab, page, pageSize);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
    },
    {
      title: "Target",
      dataIndex: "target",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Time",
      dataIndex: "createdAt",
      render: (text) => formatDateTime(text),
    },
  ];

  const tabItems = ["USER", "STUDY", "COURSE", "COUPON", "WITHDRAW"].map(
    (target) => ({
      key: target,
      label: target,
      children: (
        <div style={{ minHeight: 250, position: "relative" }}>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: 250 }}>
              <Spin />
            </div>
          ) : (
            <>
              <Table
                dataSource={logs}
                columns={columns}
                rowKey="id"
                pagination={false}
                size="small"
              />
              <div className="d-flex justify-content-center mt-3">
                <Pagination
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  onChange={handlePageChange}
                  onShowSizeChange={(current, size) => fetchLogs(activeTab, current, size)}
                />
              </div>
            </>
          )}
        </div>
      )
      ,
    })
  );

  const content = (
    <>
      {showTitle && <h3>Hoạt động gần đây</h3>}
      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} />
    </>
  );

  return showCard ? <Card className="mt-3">{content}</Card> : content;
};

export default ActivityLogs;
