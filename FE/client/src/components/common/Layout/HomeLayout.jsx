import Header from "../Header/Header";
import Footer from "../Footer/Footer";
// import PropTypes from "prop-types";
const HomeLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {children}
      <Footer />
    </div>
  );
};
// HomeLayout.propTypes = {
//   children: propTypes.node.is.Required,
// };
export default HomeLayout;
