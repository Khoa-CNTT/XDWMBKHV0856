import { useState } from "react";
import { FaPlay } from "react-icons/fa";

const PreviewVideo = (courseDetails) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  console.log(isVideoOpen);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div
          className="relative aspect-video rounded-xl overflow-hidden cursor-pointer"
          onClick={() => setIsVideoOpen(true)}
        >
          <img
            src={courseDetails.image}
            alt="Course Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <FaPlay className="text-white text-xl ml-1" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreviewVideo;
