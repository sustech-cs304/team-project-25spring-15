'use client';

import LectureList from '@/app/ui/course/lecture-list';
import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams();
  const courseId = parseInt(params.courseId as string, 10);

  return <LectureList courseId={courseId} />;
} 