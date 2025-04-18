import { Suspense } from 'react';
import { fetchCourses } from '../lib/data';
import Topbar from '../ui/dashboard/topbar';
import SideNav from '@/app/ui/dashboard/sidenav';

export const experimental_ppr = true;

export default async function Layout({ children }: { children: React.ReactNode }) {
  const courses = await fetchCourses();

  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex flex-1 pt-16 md:pt-16">
        <div className="w-full flex-none md:w-64 border-r-4 border-gray-300">
          <SideNav courses={courses} />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          <Suspense fallback={<div>加载中...</div>}>
            {children}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
