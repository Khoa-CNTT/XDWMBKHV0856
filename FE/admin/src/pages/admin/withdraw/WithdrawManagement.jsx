import { Button, Input, Modal, Popconfirm, Popover, Select, Spin, Table, Tabs } from "antd";
import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonLog from "../../../components/admin/ButtonLog";
import { ApproveWithdrawActionAsync, getAllWithdrawActionAsync } from "../../../redux/reducer/admin/withdrawReducer";
import { http } from "../../../setting/setting";
import { callApiLog } from "../../../utils/callApiLog";
import { formatDateTime } from "../../../utils/formatDateTime";

export default function WithdrawRequestAdmin() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.authReducer) || {};
  const { apiWithdraw } = useSelector((state) => state.withdrawReducer || []) ;
  const { meta } = useSelector((state) => state.withdrawReducer || {});

  // Tabs and filters
  const [activeTab, setActiveTab] = useState("PENDING");
  const [searchWallet, setSearchWallet] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

  // Pagination
  const [pagination, setPagination] = useState({
    PENDING: { page: 1, pageSize: 5 },
    PAID: { page: 1, pageSize: 5 },
  });

  // QR Code modal
  const [qrImage, setQrImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingQR, setLoadingQR] = useState(false);
  const [errorQR, setErrorQR] = useState("");

  const banks = ["VCB","VTB","TCB","BIDV","MB","VPB","ACB","TPB","VIB","VARB",];

  // Lấy dữ liệu theo tab
  const fetchWithdraws = useCallback(() => {
    const { page, pageSize } = pagination[activeTab];
    dispatch(
      getAllWithdrawActionAsync({
        page,
        size: pageSize,
        filters: {
          "wallet.user.fullName": searchWallet,
          "wallet.bank": selectedBank,
          orderStatus: activeTab,
        },
      })
    );
  }, [dispatch, pagination, activeTab, searchWallet, selectedBank]);

  useEffect(() => {
    fetchWithdraws();
  }, [fetchWithdraws]);

  // Debounce search
  const debouncedSearch = useCallback(
    debounce((walletValue, bankValue) => {
      setPagination((prev) => ({
        ...prev,
        [activeTab]: { ...prev[activeTab], page: 1 },
      }));
      dispatch(
        getAllWithdrawActionAsync({
          page: 1,
          size: pagination[activeTab].pageSize,
          filters: {
            "wallet.user.fullName": walletValue,
            "wallet.bank": bankValue,
            orderStatus: activeTab,
          },
        })
      );
    }, 500),
    [dispatch, activeTab, pagination]
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchWallet(value);
    debouncedSearch(value, selectedBank);
  };

  const handleBankChange = (value) => {
    setSelectedBank(value);
    debouncedSearch(searchWallet, value);
  };

  const showQR = async (withdrawId) => {
    setQrImage(null);
    setErrorQR("");
    setIsModalOpen(true);
    setLoadingQR(true);

    const timeoutId = setTimeout(() => {
      setLoadingQR(false);
      setErrorQR("Kết nối quá lâu, vui lòng thử lại.");
    }, 10000);

    try {
      const res = await http.post("/v1/create-withdraw-payment", { id: withdrawId });
      clearTimeout(timeoutId);
      const qrDataURL = res.data?.data?.data?.qrDataURL;
      qrDataURL ? setQrImage(qrDataURL) : setErrorQR("Không lấy được mã QR.");
    } catch (error) {
      clearTimeout(timeoutId);
      setErrorQR("Lỗi khi tải mã QR.");
    } finally {
      setLoadingQR(false);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Wallet Owner",
      key: "walletOwner",
      render: (_, record) => {
        const wallet = record.wallet;
        const user = wallet?.user;
        return (
          <Popover
            title={`Wallet - ${user?.fullName}`}
            content={
              <div>
                <div><strong>Email:</strong> {user?.email}</div>
                <div><strong>Bank:</strong> {wallet?.bank}</div>
                <div><strong>STK:</strong> {wallet?.accountNumber}</div>
                <div><strong>Owner:</strong> {wallet?.accountName}</div>
              </div>
            }
            trigger="click"
          >
            <Button type="link">{user?.fullName}</Button>
          </Popover>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `${amount.toLocaleString()} VNĐ`,
    },
    {
      title: activeTab === "PENDING" ? "Created At" : "Updated At",
      dataIndex: activeTab === "PENDING" ? "createdAt" : "updatedAt",
      key: activeTab === "PENDING" ? "createdAt" : "updatedAt",
      render: (date) => (date ? formatDateTime(date) : "N/A"),
    },
    ...(activeTab === "PENDING"
      ? [
        {
          title: "Action",
          key: "action",
          align: "center",
          render: (_, record) => (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Popconfirm
                title="Confirm Payment Approval?"
                onConfirm={async () => {
                  try {
                    const res = await dispatch(ApproveWithdrawActionAsync(record.id, "PAID"));
                    console.log({res})
                    if(res.status === 200){
                      await callApiLog(userInfo?.id, "WITHDRAW", `APPROVE a WITHDRAW with id ${record.id} for user ${record.wallet.user.email}`);
                    }
                    setActiveTab("PAID");
                  } catch (error) {
                    console.error("Error approving withdraw:", error);
                  }
                }}
              >
                <Button type="primary" size="small" style={{ marginTop: '8px',marginRight:"8px" }}>Approve</Button>
              </Popconfirm>
              <Button
                type="primary"
                danger
                size="small"
                onClick={() => showQR(record.id)}
                style={{ marginTop: '8px' }} // Thêm khoảng cách giữa các nút
              >
                View QR
              </Button>
            </div>
          ),
        }
        
        ]
      : []),
  ];

  const renderTable = () => (
    <Table
      dataSource={apiWithdraw}
      columns={columns}
      rowKey="id"
      bordered
      pagination={{
        current: pagination[activeTab].page,
        pageSize: pagination[activeTab].pageSize,
        total: meta.totalElement || 0,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "15", "20"],
        onChange: (page, pageSize) => {
          setPagination((prev) => ({
            ...prev,
            [activeTab]: { page, pageSize },
          }));
        },
      }}
    />
  );

  return (
    <>
     <div className="d-flex justify-content-end">
    <ButtonLog  tab="WITHDRAW"/>
    </div>
      <div style={{ marginBottom: 20 }}>
        <Input
          value={searchWallet}
          placeholder="Search user name..."
          onChange={handleInputChange}
          style={{ width: 300, marginRight: 10 }}
        />
        <Select
          value={selectedBank}
          onChange={handleBankChange}
          style={{ width: 200 }}
          placeholder="Select bank"
        >
          <Select.Option value="">All Banks</Select.Option>
          {banks.map((bank) => (
            <Select.Option key={bank} value={bank}>
              {bank}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        items={[
          { key: "PENDING", label: "Pending", children: renderTable() },
          { key: "PAID", label: "Approved", children: renderTable() },
        ]}
      />
      <Modal
        title="Mã QR để chuyển tiền"
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        {loadingQR ? (
          <div style={{ textAlign: "center", padding: 30 }}>
            <Spin size="large" tip="Đang tải mã QR..." />
          </div>
        ) : errorQR ? (
          <div style={{ textAlign: "center", padding: 30, color: "red" }}>
            {errorQR}
          </div>
        ) : qrImage ? (
          <img src={qrImage} alt="QR Code" style={{ width: "100%" }} />
        ) : (
          <p>No data QR.</p>
        )}
      </Modal>
    </>
  );
}
