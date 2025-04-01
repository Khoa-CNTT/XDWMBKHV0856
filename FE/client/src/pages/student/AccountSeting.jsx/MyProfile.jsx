import React, { useState } from "react";
import Profile from "./Profile";
import MyCourser from "./MyCourser";
import CourseReviews from "./CourseReviews";

const MyProfile = () => {
  const [activeTab, setActiveTab] = useState("courses");

  return (
    <div className="justify-center p-6 mx-auto">
      <Profile />

      <div className="flex border-b mb-6 max-w-4xl rounded-lg mt-3">
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "courses"
              ? "border-b-2 border-red-500 text-red-500"
              : "text-gray-700"
          }`}
          onClick={() => setActiveTab("courses")}
        >
          Instructor's course
        </button>
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "reviews"
              ? "border-b-2 border-red-500 text-red-500"
              : "text-gray-700"
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          Review
        </button>
      </div>
      <div className="">
        {activeTab === "courses" ? <MyCourser /> : <CourseReviews />}
      </div>
    </div>
  );
};
export default MyProfile;
