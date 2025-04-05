import {
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { Avatar, Button, Layout } from "antd";
import { useCallback } from "react";

const { Header } = Layout;

const HeaderBar = ({ collapsed, setCollapsed }) => {
  const avatarUrl = "https://anhnail.com/wp-content/uploads/2024/11/son-goku-ngau-nhat.jpg";

  // Dùng useCallback để tối ưu toggle sidebar
  const toggleSidebar = useCallback(() => setCollapsed((prev) => !prev), [setCollapsed]);

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
        <Avatar src={avatarUrl} size={40} />
        <Button
          type="text"
          icon={<LogoutOutlined />}
          style={{ color: "#fff", transition: "0.3s" }}
        />
      </div>
    </Header>
  );
};

export default HeaderBar;
