import { FaComments, FaEnvelope, FaPhone } from "react-icons/fa";

const NeedHelp = () => {
  return (
    <>
      <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Need Help?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phone Support */}
          <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-700 rounded-lg">
            <FaPhone className="text-primary text-xl" />
            <div>
              <h3 className="font-semibold dark:text-white">Phone Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                +1 (555) 123-4567
              </p>
            </div>
          </div>
          {/* Email Support */}
          <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-700 rounded-lg">
            <FaEnvelope className="text-primary text-xl" />
            <div>
              <h3 className="font-semibold dark:text-white">Email Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                support@course.com
              </p>
            </div>
          </div>
          {/* Live Chat */}
          <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-700 rounded-lg">
            <FaComments className="text-primary text-xl" />
            <div>
              <h3 className="font-semibold dark:text-white">Live Chat</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Available 24/7
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NeedHelp;
