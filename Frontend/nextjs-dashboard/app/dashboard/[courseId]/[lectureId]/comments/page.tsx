// app/dashboard/[courseId]/[lectureId]/comments/page.tsx
type Params = Promise<{ courseId: string; lectureId: string }>;

import CommentView from "@/app/ui/lecture/comment-view";

export default async function Page({params}: { params: Params }) {
  const { courseId, lectureId }: { courseId: string; lectureId: string } = await params;

  return (
    <main>
      <CommentView
        courseIdString={courseId || '1'} lectureIdString={lectureId}
      />
    </main>
  );
}
