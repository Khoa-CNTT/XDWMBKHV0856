import PropTypes from "prop-types";

const Input = ({ icon, ...props }) => (
  <div className="flex items-center border rounded-lg p-4 shadow-sm text-lg w-full focus-within:ring-2 focus-within:ring-blue-500">
    {icon && <span className="text-gray-500 mr-3">{icon}</span>}
    <input className="flex-1 focus:outline-none" {...props} />
  </div>
);
Input.propTypes = {
  icon: PropTypes.node,
};

export default Input;
