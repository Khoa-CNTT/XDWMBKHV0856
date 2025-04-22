import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default HomeLayout;
