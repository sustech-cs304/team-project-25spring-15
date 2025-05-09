"use client";

import {
  CheckCircleIcon,
  ArrowPathIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { Course, Lecture } from "@/app/lib/definitions";
import { Card, Typography } from "@mui/material";

interface CardWrapperProps {
  courses: Course[];
}

const iconMap = {
  notStarted: RocketLaunchIcon,
  inProgress: ArrowPathIcon,
  done: CheckCircleIcon,
};

export default function CardWrapper({ courses }: CardWrapperProps) {
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
            <CourseCard
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

export function CourseCard({
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
