import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import { items } from "../MenuItem";

const Sidebar = () => {
  const navigate = useNavigate(); 
  const location = useLocation(); 

  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#001529", color: "white" }}>
      <div style={{ padding: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
        <img src={logo} alt="V-Learning Admin" style={{ width: "120px", height: "auto" }} />
      </div>

      <Menu
        mode="inline"
        onClick={handleMenuClick}
        theme="dark"
        items={items}
        selectedKeys={[location.pathname.split("/")[1]]} 
      />
    </div>
  );
};

export default Sidebar;
