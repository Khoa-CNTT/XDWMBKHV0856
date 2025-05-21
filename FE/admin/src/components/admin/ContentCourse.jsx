import { EyeOutlined } from "@ant-design/icons";
import { Collapse, List } from "antd";
import React, { useState } from "react";

const ContentCourse = ({ chapters, id }) => {
  const [visibleVideoId, setVisibleVideoId] = useState(null);

  if (!chapters || chapters.length === 0)
    return <div className="text-muted fst-italic">No content available.</div>;

  const items = chapters.map((chapter) => ({
    key: chapter.id.toString(),
    label: (
      <strong style={{ fontSize: 16 }}>{chapter.title}</strong>
    ),
    children: chapter.lectures?.length > 0 ? (
      <List
        itemLayout="horizontal"
        dataSource={chapter.lectures}
        renderItem={(lecture, lectureIndex) => {
            const videoUrl = `http://localhost:8080/storage/lecture/${lecture.id}/${encodeURIComponent(lecture.file)}`;
            const isVisible = visibleVideoId === lecture.id;
          
            return (
              <List.Item>
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div className="div">
                    <span style={{ fontSize: 16 }}>
                      Bài {lectureIndex + 1}: {lecture.title}
                    </span>
                    <br/>
                    
                    </div>
                    {lecture.file && (
                      <EyeOutlined
                        style={{
                          cursor: "pointer",
                          fontSize: 20,
                          color: isVisible ? "#1890ff" : "#888",
                          marginLeft: 8,
                        }}
                        onClick={() =>
                          setVisibleVideoId(isVisible ? null : lecture.id)
                        }
                      />
                    )}
                  </div>
                  {isVisible && (
                    <video
                      width="100%"
                      height="auto"
                      controls
                      style={{ marginTop: 8, borderRadius: 8 }}
                    >
                      <source src={videoUrl} type="video/mp4" />
                      Trình duyệt của bạn không hỗ trợ HTML5 video.
                    </video>
                  )}
                </div>
              </List.Item>
            );
          }}
          
      />
    ) : (
      <div className="text-muted">No lectures in this chapter.</div>
    ),
  }));

  return <Collapse accordion items={items} className="mt-2" />;
};

export default ContentCourse;
