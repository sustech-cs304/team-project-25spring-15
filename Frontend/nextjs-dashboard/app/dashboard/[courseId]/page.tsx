'use server';

import { fetchCourses } from "@/app/lib/server-api";
import { Course } from "@/app/lib/definitions";
import { LectureCardWrapper } from "@/app/ui/course/cards";
import { CardsSkeleton } from "@/app/ui/skeletons";

export default async function Page() {
  const courses: Course[] = await fetchCourses();
  return (
    <main>
      <div>
        <LectureCardWrapper courses={courses} />
      </div>
    </main>
  );
}
