import { ReactNode } from "react";
import { Card } from "@mui/material";
import ContentLinks from "@/app/ui/lecture/content-link"; // 导入标签栏组件
import { fetchCourses } from "@/app/lib/server-api";
import LectureSidebar from "@/app/ui/lecture/lecture-sidebar"; // 导入侧边栏组件

export const experimental_ppr = true;

interface LectureLayoutProps {
  children: ReactNode;
  params: Promise<{
    courseId: string;
    lectureId: string;
  }>;
}

export default async function LectureLayout({ children, params }: LectureLayoutProps) {
  const courses = await fetchCourses();
  const {courseId, lectureId} = await params;
  const courseIdNum = Number(courseId);
  const lectureIdNum = Number(lectureId);

  return (
    <div
      style={{
        display: "flex",
        height: "calc(94vh - 64px)",         // 让容器高度充满视口
        overflow: "hidden",      // 禁止页面滚动
      }}
    >
      {/* 左侧功能侧边栏 */}
      <div
        style={{
          width: 240,            // 你想要的侧边栏宽度
          height: "calc(94vh - 64px)",       // 高度充满
          flexShrink: 0,         // 不缩小
          background: "#f5f5f5", // 可选：背景色
          borderRight: "1px solid #e0e0e0",
        }}
      >
        <LectureSidebar courseId={courseIdNum} lectureId={lectureIdNum} />
      </div>

      <div style={{ width: 32, background: "#f8fafc" }} />

      {/* 右侧内容区域 */}
      <div className="flex-grow">
        <Card
          sx={{
            flexGrow: 1,
            height: "calc(94vh - 64px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            padding: "10px",
            border: "2px solid #e0e0e0",
            borderRadius: "8px",
          }}
        >
          {/* 顶部标签栏 */}
          {/* <ContentLinks /> */}

          {/* 内容区域 - 渲染子路由 */}
          <div className="content-container">
            {children}
          </div>
        </Card>
      </div>
    </div>
  );
}
