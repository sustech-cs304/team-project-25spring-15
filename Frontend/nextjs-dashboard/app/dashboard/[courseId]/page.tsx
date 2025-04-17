'use server';

import { Course, fetchCourses } from "@/app/lib/data";
import CardWrapper from "@/app/ui/dashboard/cards";
import { CardsSkeleton } from "@/app/ui/skeletons";

export default async function Page() {
  const courses: Course[] = await fetchCourses();
  return (
    <main>
      <div>
        <CardWrapper courses={courses} />
      </div>
    </main>
  );
}
