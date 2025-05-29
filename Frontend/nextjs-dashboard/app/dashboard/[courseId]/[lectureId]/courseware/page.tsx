// app/dashboard/[courseId]/[lectureId]/courseware/page.tsx
import CoursewareView from "@/app/ui/lecture/courseware-view";

type PageProps = {
  // Next.js 15 要求 params 是一个 Promise
  params: Promise<{
    courseId: string;
    lectureId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  // await 一下才能解出真正的 courseId 和 lectureId
  const { courseId, lectureId } = await params;

  return (
    <main>
      {/* 这里通常不需要再做 '|| "1"' 的兜底，路由里一定会给到 */}
      <CoursewareView
        courseId={courseId}
        lectureId={lectureId}
      />
    </main>
  );
}
