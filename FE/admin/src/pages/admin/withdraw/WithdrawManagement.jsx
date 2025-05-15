import {
  Button,
  Card,
  Input,
  Modal,
  Popconfirm,
  Popover,
  Select,
  Spin,
  Table
} from "antd";
import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApproveWithdrawActionAsync, getAllWithdrawActionAsync } from "../../../redux/reducer/admin/withdrawReducer";
import { http } from "../../../setting/setting";
import { formatDateTime } from "../../../utils/formatDateTime";
const banks = [
  "VCB",
  "VTB",
  "TCB",
  "BIDV",
  "MB",
  "VPB",
  "ACB",
  "TPB",
  "VIB",
  "VARB",
];
export default function WithdrawRequestAdmin() {
  const { apiWithdraw } = useSelector((state) => state.withdrawReducer) || [];
  const { meta } = useSelector((state) => state.withdrawReducer) || {};
  const [page, setPage] = useState(1);
  const [pageSize, setPagesize] = useState(5);
  const [qrImage, setQrImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchWallet, setSearchWallet] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [loadingQR, setLoadingQR] = useState(false);
  const [errorQR, setErrorQR] = useState("");

  const dispatch = useDispatch();
  const debouncedSearch = useCallback(
    debounce((walletValue, bankValue) => {
      dispatch(
        getAllWithdrawActionAsync({
          page: 1,
          size: pageSize,
          filters: {
            "wallet.user.fullName": walletValue,
            "wallet.bank": bankValue,
          },
        })
      );
      setPage(1);
    }, 500),
    [dispatch, pageSize]
  );
  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchWallet(value);
      debouncedSearch(value, selectedBank);
    },
    [debouncedSearch, selectedBank]
  );

  const handleBankChange = (value) => {
    setSelectedBank(value);
    debouncedSearch(searchWallet, value);
  };

  // Hàm hiển thị mã QR
  const showQR = async (withdrawId) => {
    setQrImage(null);
    setErrorQR("");
    setIsModalOpen(true);
    setLoadingQR(true);

    // Đặt timeout: Nếu sau 10s mà chưa có QR thì tự báo lỗi
    const timeoutId = setTimeout(() => {
      setLoadingQR(false);
      setErrorQR("Kết nối quá lâu, vui lòng thử lại.");
    }, 10000); // 10 giây
    try {
      const res = await http.post("/v1/create-withdraw-payment", {
        id: withdrawId,
      });
      const qrDataURL = res.data?.data?.data?.qrDataURL;
      clearTimeout(timeoutId); // Hủy timeout nếu call thành công

      if (qrDataURL) {
        setQrImage(qrDataURL);
      } else {
        setErrorQR("Unable to retrieve the QR code.");
      }
    } catch (error) {
      console.error("Error generating QR:", error);
      clearTimeout(timeoutId); // Hủy timeout nếu fail
      setErrorQR("An error occurred while loading the QR code.");
    } finally {
      setLoadingQR(false);
    }
  };

  // Lấy dữ liệu
  useEffect(() => {
      dispatch(getAllWithdrawActionAsync({ page: page, size: pageSize }));
  }, [dispatch, page, pageSize]);

  //Debounce vs clean up fuction
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Wallet Owner",
      dataIndex: ["wallet", "user", "fullName"],
      key: "walletOwner",
      render: (_, record) => {
        const wallet = record.wallet;
        const user = wallet?.user;

        return (
          <Popover
            title={`Detail wallet - ${user?.fullName}`}
            content={
              <div style={{ lineHeight: 1.5 }}>
                <div>
                  <strong>Email:</strong> {user?.email}
                </div>
                <div>
                  <strong>Bank:</strong> {wallet?.bank}
                </div>
                <div>
                  <strong>STK:</strong> {wallet?.accountNumber}
                </div>
                <div>
                  <strong>Owner:</strong> {wallet?.accountName}
                </div>
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
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createAt) => formatDateTime(createAt),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Popconfirm
            title="Confirm Payment Approval?"
            description="Are you sure you want to approve this request?"
            okText="Approve"
            cancelText="Cancel"
            onConfirm={() => dispatch(ApproveWithdrawActionAsync( record.id, "PAID" ))}
          >
            <Button type="primary" size="small" className="ms-2">
              Approve
            </Button>
          </Popconfirm>
          <Button
            type="primary"
            className="ms-2"
            danger
            size="small"
            onClick={() => showQR(record.id)}
          >
            View QR
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Card title="Withdraw Manage">
        <Input
          value={searchWallet}
          placeholder="Search user name ..."
          onChange={handleInputChange}
          style={{ width: 300, marginBottom: "20px" }}
        />
        <Select
          value={selectedBank}
          onChange={handleBankChange}
          style={{ width: 200, marginLeft: 10, marginBottom: "20px" }}
          placeholder="Select bank"
        >
          <Select.Option value="">All Banks</Select.Option>
          {banks.map((bank) => (
            <Select.Option key={bank} value={bank}>
              {bank}
            </Select.Option>
          ))}
        </Select>
        <Table
          dataSource={apiWithdraw?.filter(
            (item) => item.orderStatus === "PENDING"
          )}
          className="admin-table"
          columns={columns}
          rowKey="id"
          bordered
          pagination={{
            current: page,
            pageSize: pageSize,
            total: meta?.totalElement || 0,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "15", "20"],
          }}
          onChange={(pagination) => {
            setPage(pagination.current);
            setPagesize(pagination.pageSize);
          }}
        />
      </Card>
      <Modal
        title="Mã QR để chuyển tiền"
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        {loadingQR ? (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <Spin size="large" tip="loading QR..." />
          </div>
        ) : errorQR ? (
          <div style={{ textAlign: "center", padding: "30px 0", color: "red" }}>
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
