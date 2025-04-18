import {Box, Card, Tabs, Tab, Typography} from '@mui/material';
import { fetchCourses } from '@/app/lib/data';
import ContentLink from '@/app/ui/lecture/content-link';

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const courses = await fetchCourses();

  return (
    <div>
      {children}
    </div>
  );
}
