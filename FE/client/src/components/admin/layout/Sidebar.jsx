import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import { items } from "../MenuItem";
const Sidebar = ({ setCurrentType }) => {
    const navigate = useNavigate(); 
    const handleMenuClick = (e) => {
        const clickedItem = items.find(item => item.key === e.key);
        if (clickedItem) {
          setCurrentType(clickedItem.type);  
        }
        navigate(e.key);
      };
    return (
        <div style={{ width: "100%", height: "100%", background: "#001529", color: "white" }}>
            <div>
            <button onClick={() => {
                navigate("/")
            }} style={{padding:"10px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",width:"100%"}}>
                <img src={logo} alt="V-Learning Admin" style={{ width: "120px", height: "auto" }} />
            </button>
            </div>
            <Menu mode="inline" onClick={handleMenuClick} theme="dark" items={items} />
        </div>
    );
};

export default Sidebar;
