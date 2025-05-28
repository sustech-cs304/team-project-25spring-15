'use client';

import StudentList from '@/app/ui/course/student-list';
import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams();
  const courseId = parseInt(params.courseId as string, 10);

  return <StudentList courseId={courseId} />;
} 