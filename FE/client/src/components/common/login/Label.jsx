import PropTypes from "prop-types";

const Label = ({ children, htmlFor }) => (
  <label
    className="block font-semibold mb-3 text-gray-700 text-lg text-left"
    htmlFor={htmlFor}
  >
    {children}
  </label>
);
Label.propTypes = {
  children: PropTypes.node.isRequired,
  htmlFor: PropTypes.string.isRequired,
};

export default Label;
