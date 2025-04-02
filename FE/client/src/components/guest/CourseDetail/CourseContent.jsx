const CourseContent = (courseDetails) => {
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          Course Content
        </h2>
        <div className="space-y-4">
          {courseDetails.topics.map((topic, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 dark:border-gray-700"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold dark:text-white">{topic}</h3>
                <span className="text-sm text-gray-500">45 min</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CourseContent;
