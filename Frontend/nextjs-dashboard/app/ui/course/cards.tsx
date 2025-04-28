"use client";

import {
  CheckCircleIcon,
  ArrowPathIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { Course, Lecture } from "@/app/lib/definitions";
import Link from "next/link";
import { Card } from "@mui/material";

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
      (course) => course.id.toString() === courseId
    );
    if (currentCourse) {
      console.log(currentCourse.lectures);
      currentLectures = currentCourse.lectures || [];
      currentCouseTitle = currentCourse.title || "";
    }
  }

  if (currentLectures.length === 0) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <p>No lectures found</p>
      </div>
    );
  }

  return (
    <>
      <Card
        sx={{
          flexGrow: 1,
          height: "calc(94vh - 64px)",
          overflow: "hidden",
          padding: "24px",
          borderColor: `2px solid #e0e0e0`,
          borderRadius: "8px", // 增加一点圆角
        }}
      >
        <h1 className={`mb-4 text-xl md:text-2xl`}>{currentCouseTitle}</h1>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentLectures.map((lecture) => (
            <CourseCard
              key={lecture.id}
              title={"lecture" + lecture.id}
              value={lecture.title || ""}
              type={lecture.status || "notStarted"}
              courseId={pathname.split("/")[2]}
              lectureId={lecture.id}
            />
          ))}
        </div>
      </Card>
    </>
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
  console.log(lectureId);
  console.log(courseId);

  return (
    <div className="rounded-xl bg-gray-300 p-3 shadow-sm relative">
      <Link
        href={`/dashboard/${courseId}/${lectureId}`}
        className="absolute inset-0 z-10"
        aria-label={`查看讲座: ${title}`}
      >
        <span className="sr-only">查看讲座详情</span>
      </Link>
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
