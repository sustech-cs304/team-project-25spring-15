'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Button,
  Box,
  Tabs,
  Tab
} from '@mui/material';
import { Course } from '@/app/lib/definitions';
import { useStore } from '@/store/useStore';
import CourseCard from './cards';
import AddIcon from '@mui/icons-material/Add';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export default function CourseList() {
  const router = useRouter();
  const courses = useStore(state => state.courses);
  const userInfo = useStore(state => state.userInfo);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCourseClick = (courseId: number) => {
    router.push(`/dashboard/course/${courseId}`);
  };

  // 根据用户身份和选项卡筛选课程
  const filteredCourses = Array.isArray(courses) 
    ? courses.filter(course => {
        if (!course) return false; // 跳过无效课程对象
        
        if (tabValue === 0) return true; // 全部课程
        if (tabValue === 1) { // 我的课程
          if (userInfo?.identity === 'teacher') {
            return course.teacherId === userInfo.userId;
          } else {
            // 假设学生已注册的课程在将来会有一个字段标识，这里暂时显示所有课程
            return true;
          }
        }
        return false;
      })
    : null; // 如果courses不是数组，则设为null触发加载状态

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          课程中心
        </Typography>

        {userInfo?.identity === 'teacher' && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => router.push('/dashboard/create-course')}
          >
            新建课程
          </Button>
        )}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab icon={<MenuBookIcon />} label="全部课程" />
          <Tab icon={<SchoolIcon />} label="我的课程" />
        </Tabs>
      </Box>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCourses == null ? (
          // 还没拿到数据
          <div className="col-span-full text-center py-8 text-gray-500">
            加载中...
          </div>
        ) : filteredCourses.length === 0 ? (
          // 数据已加载，但为空
          <div className="col-span-full text-center py-8 text-gray-500">
            暂无课程
          </div>
        ) : (
          // 正常渲染列表
          filteredCourses.map((course) => (
            <div key={course.courseId} className="mb-4">
              <CourseCard
                course={course}
                onClick={() => handleCourseClick(course.courseId)}
              />
            </div>
          ))
        )}
      </div>
    </Container>
  );
}
