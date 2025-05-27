'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { CourseAPI } from '@/app/lib/client-api';
import CourseList from '../ui/course/course-list';

export default function Page() {
  const setCourses = useStore(state => state.setCourses);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      try {
        const courses = await CourseAPI.fetchCourses();
        if (courses) {
          setCourses(courses);
        } else {
          // 如果返回结果无效，设置为空数组
          setCourses([]);
        }
      } catch (error) {
        console.error('加载课程失败:', error);
        setError(error instanceof Error ? error : new Error('加载课程失败'));
        // 确保在出错时仍然设置一个空数组
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadCourses();
  }, [setCourses]);
  
  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">加载课程数据失败</div>
        <div className="text-gray-500 text-sm">{error.message}</div>
      </div>
    );
  }
  
  return <CourseList />;
}
