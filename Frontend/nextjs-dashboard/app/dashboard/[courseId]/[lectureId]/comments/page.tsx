import CommentView from "@/app/ui/lecture/comment-view";

interface PageProps {
  params: {
    courseId: number;
    lectureId: number;
  };
}

export default function Page({ params }: PageProps) {
  const { courseId, lectureId } = params;

  return (
    <main>
      <CommentView courseId={courseId} lectureId={lectureId} />
    </main>
  );
}
