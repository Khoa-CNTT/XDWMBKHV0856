import PropTypes from "prop-types";

const Card = ({ children }) => (
  <div className="bg-white shadow-xl rounded-2xl p-10 w-[40rem] border border-gray-200 bg-opacity-90 relative ">
    {children}
  </div>
);
Card.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Card;
