import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export default function CoursePreview({ course }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 flex flex-col items-center justify-center">
        <div className="w-full h-40">
          <img
            src={`${import.meta.env.VITE_COURSE_IMAGE_URL}/${course?.id}/${
              course?.image
            }`}
            alt="Course preview"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-4 space-y-4 w-full">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">
                {course?.price.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
          </div>
          <Link
            className="flex items-center justify-center w-full py-2 text-white bg-primary rounded-md hover:opacity-80 transition duration-200"
            to={`/student/checkout/${course?.id}`}
          >
            Buy Now
          </Link>

          <div className="text-center text-sm text-muted-foreground">
            30-day money-back guarantee
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
