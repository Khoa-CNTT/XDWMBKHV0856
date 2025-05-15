import {
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { Avatar, Button, Layout, Modal } from "antd";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import avatar from "../../../assets/images/avatar.png";
import { getAccountProfile, logoutActionAsync } from "../../../redux/reducer/auth/authReducer";

const { Header } = Layout;

const HeaderBar = ({ collapsed, setCollapsed }) => {
  const { userInfo } = useSelector((state) => state.authReducer) || {};
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    if (!userInfo ) { 
      dispatch(getAccountProfile());
    }
  }, [userInfo, dispatch]);
  // Dùng useCallback để tối ưu toggle sidebar
  const toggleSidebar = useCallback(() => setCollapsed((prev) => !prev), [setCollapsed]);
  //nut đăng xuất
  const handleLogout = () => {
    Modal.confirm({
      title: "Confirm Logout",
      content: "Are you sure you want to log out?",
      okText: "Logout",
      cancelText: "Cancel",
      onOk: () => {
        dispatch(logoutActionAsync());                  
      },
    });
  };
  
  return (
    <Header
      style={{
        position: "fixed", // Cố định header
        top: 0,
        left: collapsed ? "0" : "250px",
        width: collapsed ? "100%" : "calc(100% - 250px)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#E11D48",
        padding: "0 16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        color: "#fff",
        transition: "left 0.3s ease, width 0.3s ease",
      }}
    >
      {/* Nút Toggle Sidebar */}
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggleSidebar}
        style={{ color: "#fff", fontSize: "18px" }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* <Input 
          placeholder="Search..." 
          prefix={<SearchOutlined style={{ color: "#999" }} />} 
          style={{ width: 200, background: "#fff", borderRadius: 4 }}
        /> */}
        <Button type="text" icon={<BellOutlined />} style={{ color: "#fff" }} />
        <Button
          type="text"
          icon={<SettingOutlined />}
          style={{ color: "#fff", transition: "0.3s" }}
        />
        <Avatar src={userInfo?.avatar
  ? `http://localhost:8080/storage/avatar/${userInfo?.id}/${userInfo?.avatar}`
  : avatar} size={40} className="bg-dark" />
        <Button
          type="text"
          icon={<LogoutOutlined />}
          style={{ color: "#fff", transition: "0.3s" }}
          onClick={handleLogout}
        />
      </div>
    </Header>
  );
};

export default HeaderBar;
