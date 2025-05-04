import CoursewareView from "@/app/ui/lecture/courseware-view";

type PageProps = {
  params: {
    courseId: string;
    lectureId: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { courseId, lectureId } = await params;

  return (
    <main>
      <CoursewareView courseId={courseId} lectureId={lectureId}/>
    </main>
  );
}
