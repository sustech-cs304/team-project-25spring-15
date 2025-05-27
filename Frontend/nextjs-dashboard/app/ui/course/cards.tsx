"use client";

import {
  CheckCircleIcon,
  ArrowPathIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { Course, Lecture } from "@/app/lib/definitions";
import { Card, Typography, CardContent, CardActionArea, Box, Chip } from "@mui/material";

interface CardWrapperProps {
  courses: Course[];
}

// 新增的CourseCard接口
interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

const iconMap = {
  notStarted: RocketLaunchIcon,
  inProgress: ArrowPathIcon,
  done: CheckCircleIcon,
};

// 新增用于课程列表显示的CourseCard组件
export default function CourseCard({ course, onClick }: CourseCardProps) {
  // 添加空值检查
  if (!course) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
        <Typography color="text.secondary">课程数据加载中...</Typography>
      </Card>
    );
  }
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea onClick={onClick} sx={{ flexGrow: 1 }}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom noWrap>
            {course.courseName || '未命名课程'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {course.description || '暂无描述'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Chip 
              label={`${course.lectures?.length || 0} 讲座`} 
              size="small" 
              variant="outlined"
            />
            <Typography variant="caption" color="text.secondary">
              {course.startTime ? new Date(course.startTime).toLocaleDateString() : '无日期'}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

// 旧的卡片组件，重命名为LectureCardWrapper
export function LectureCardWrapper({ courses }: CardWrapperProps) {
  console.log("courses in CardWrapper:", courses);
  const pathname = usePathname();
  let currentCouseTitle = "";
  let currentLectures: Lecture[] = [];

  if (pathname && pathname.startsWith("/dashboard/")) {
    const courseId = pathname.split("/")[2];

    const currentCourse = courses?.find(
      (course) => course.courseId.toString() === courseId
    );
    if (currentCourse) {
      currentLectures = currentCourse.lectures || [];
      currentCouseTitle = currentCourse.courseName || "";
    }
  }

  return (
    <Card
      sx={{
        flexGrow: 1,
        height: "calc(94vh - 64px)",
        overflow: "hidden",
        padding: "24px",
        borderColor: `2px solid #e0e0e0`,
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h4" gutterBottom>
        {currentCouseTitle || "请选择一个课程"}
      </Typography>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentLectures.length > 0 ? (
          currentLectures.map((lecture) => (
            <LectureCard
              key={lecture.lectureId}
              title={lecture.lectureName || "未命名讲座"}
              value={lecture.status || "notStarted"}
              type={lecture.status || "notStarted"}
              courseId={pathname.split("/")[2]}
              lectureId={lecture.lectureId}
            />
          ))
        ) : (
          <Typography variant="body1">暂无讲座</Typography>
        )}
      </div>
    </Card>
  );
}

// 原CourseCard组件重命名为LectureCard
export function LectureCard({
                             title,
                             value,
                             type,
                             lectureId,
                             courseId,
                           }: {
  title: string;
  value: number | string;
  type: "done" | "inProgress" | "notStarted";
  lectureId: string | number;
  courseId: string | number;
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-300 p-3 shadow-sm relative">
      <div className="flex p-4 relative z-0">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`truncate rounded-xl bg-white px-4 py-8 text-center text-2xl relative z-0`}
      >
        {value}
      </p>
    </div>
  );
}
