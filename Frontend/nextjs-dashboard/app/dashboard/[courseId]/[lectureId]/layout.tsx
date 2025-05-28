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
    <div className="flex">
      {/* 左侧功能侧边栏 */}
      <LectureSidebar courseId={courseIdNum} lectureId={lectureIdNum} />

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
          <ContentLinks />

          {/* 内容区域 - 渲染子路由 */}
          <div className="content-container">
            {children}
          </div>
        </Card>
      </div>
    </div>
  );
}
