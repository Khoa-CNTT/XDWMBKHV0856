import { ClockCircleOutlined } from '@ant-design/icons';
import { Button, List, Modal, Pagination, Spin } from 'antd';
import React, { useState } from 'react';
import { http } from '../../setting/setting';
import { formatDateTime } from '../../utils/formatDateTime';

const ButtonLog = ({ tab }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const fetchLogs = async (page = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const res = await http.get(
        `/v1/logs?sort=id,desc&filter=target:'${tab}'&page=${page}&size=${pageSize}`
      );
      const { result, meta } = res.data.data;
      setLogs(result);
      setPagination({
        current: meta.page,
        pageSize: meta.size,
        total: meta.totalElement,
      });
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsModalOpen(true);
    fetchLogs(1, pagination.pageSize);
  };

  const handleCancel = () => setIsModalOpen(false);

  const handlePageChange = (page, pageSize) => {
    fetchLogs(page, pageSize);
  };

  return (
    <>
      <Button
        type="primary"
        icon={<ClockCircleOutlined />}
        onClick={handleOpen}
      >
        Xem lịch sử
      </Button>

      <Modal
        title={<><strong style={{fontSize:"20px"}}>Lịch sử hoạt động</strong></>}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={500}
        styles={{ minHeight: '300px', maxHeight: '60vh', overflowY: 'auto' }}
      >
        {loading ? (
          <div className="text-center my-4">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <List
              dataSource={logs}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <div>
                    <div>
                      <strong>{item.user.email}</strong> -{' '}
                      {formatDateTime(item.createdAt)}
                    </div>
                    <div>{item.description}</div>
                  </div>
                </List.Item>
              )}
            />
            <div className="d-flex justify-content-end mt-3">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default ButtonLog;
