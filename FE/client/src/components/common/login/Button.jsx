import PropTypes from "prop-types";

const Button = ({ children, ...props }) => (
  <button
    className="bg-gradient-to-r from-red-500 to-blue-600 text-white py-4 px-6 rounded-lg w-full text-lg hover:opacity-90 transition shadow-md"
    {...props}
  >
    {children}
  </button>
);
Button.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Button;
