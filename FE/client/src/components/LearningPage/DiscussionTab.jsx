import { FiMessageSquare } from "react-icons/fi";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { useState } from "react";

const DiscussionTab = () => {
  const [comment, setComment] = useState("");

  const handlePostComment = () => {
    alert("Comment functionality will be implemented in the future.");
    setComment("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>HV</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <textarea
            className="w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Đặt câu hỏi hoặc chia sẻ ý kiến của bạn..."
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <Button onClick={handlePostComment}>Đăng bình luận</Button>
          </div>
        </div>
      </div>

      {/* Sample comment thread */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>NVA</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">Nguyễn Văn A</span>
              <span className="text-sm text-muted-foreground">
                2 ngày trước
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                Giảng viên
              </span>
            </div>
            <p className="my-2">
              Làm thế nào để tối ưu hiệu suất khi sử dụng JSX với số lượng lớn
              phần tử?
            </p>
            <div className="flex items-center gap-4 text-sm">
              <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                <FiMessageSquare />
                <span>Trả lời</span>
              </button>
            </div>

            {/* Nested reply */}
            <div className="mt-4 ml-8 space-y-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>GV</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Giảng viên</span>
                    <span className="text-sm text-muted-foreground">
                      1 ngày trước
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      Giảng viên
                    </span>
                  </div>
                  <p className="my-2">
                    Bạn có thể sử dụng React.memo, useMemo và useCallback để
                    tránh render không cần thiết. Ngoài ra, việc sử dụng key
                    đúng cách cũng rất quan trọng khi render danh sách.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                      <FiMessageSquare />
                      <span>Trả lời</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionTab;
