'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
  Chip,
  Paper,
  alpha,
} from '@mui/material';
import { Course } from '@/app/lib/definitions';
import { useStore } from '@/store/useStore';
import CourseCard from './cards';
import AddIcon from '@mui/icons-material/Add';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { PageWrapper, AnimatedContainer, AnimatedCard, FadeIn, LoadingSpinner } from '@/app/ui/animations';

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
    <PageWrapper>
      {/* 背景渐变 */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '40vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          zIndex: -1,
        }}
      />
      
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* 头部区域 */}
        <FadeIn delay={0.1}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 6,
            pt: 4,
          }}>
            <Box>
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  color: 'white',
                  fontWeight: 700,
                  mb: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                课程中心
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: alpha('#ffffff', 0.9),
                  fontWeight: 400,
                }}
              >
                探索知识的海洋，开启学习之旅
              </Typography>
            </Box>

            {userInfo?.identity === 'teacher' && (
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => router.push('/dashboard/create-course')}
                sx={{
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: 'white',
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                新建课程
              </Button>
            )}
          </Box>
        </FadeIn>

        {/* 标签页区域 */}
        <FadeIn delay={0.2}>
          <Paper
            elevation={0}
            sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              mb: 4,
              overflow: 'hidden',
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    minHeight: 64,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                  },
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                    background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                  },
                }}
              >
                <Tab 
                  icon={<MenuBookIcon sx={{ fontSize: 24 }} />} 
                  label="全部课程" 
                  iconPosition="start"
                  sx={{ gap: 1 }}
                />
                <Tab 
                  icon={<SchoolIcon sx={{ fontSize: 24 }} />} 
                  label="我的课程" 
                  iconPosition="start"
                  sx={{ gap: 1 }}
                />
              </Tabs>
            </Box>

            {/* 统计信息 */}
            <Box sx={{ p: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
              <Chip
                label={`共 ${filteredCourses?.length || 0} 门课程`}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
              {userInfo?.identity === 'teacher' && (
                <Chip
                  label={`我创建的课程: ${courses?.filter(c => c.teacherId === userInfo.userId).length || 0}`}
                  color="secondary"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              )}
            </Box>
          </Paper>
        </FadeIn>

        {/* 课程网格 */}
        <AnimatedContainer>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 3,
              pb: 6,
            }}
          >
            {filteredCourses == null ? (
              // 加载状态
              <Box 
                sx={{ 
                  gridColumn: '1 / -1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 8,
                  gap: 2,
                }}
              >
                <LoadingSpinner />
                <Typography variant="h6" color="text.secondary">
                  正在加载课程...
                </Typography>
              </Box>
            ) : filteredCourses.length === 0 ? (
              // 空状态
              <FadeIn delay={0.3}>
                <Paper
                  sx={{
                    gridColumn: '1 / -1',
                    p: 8,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    border: '2px dashed',
                    borderColor: 'divider',
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h5" color="text.secondary" gutterBottom>
                    暂无课程
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {userInfo?.identity === 'teacher' 
                      ? '点击上方按钮创建您的第一门课程' 
                      : '请联系老师添加您到相关课程中'
                    }
                  </Typography>
                </Paper>
              </FadeIn>
            ) : (
              // 课程列表
              filteredCourses.map((course, index) => (
                <AnimatedCard
                  key={course.courseId}
                  delay={index * 0.1}
                  onClick={() => handleCourseClick(course.courseId)}
                >
                  <CourseCard course={course} onClick={() => handleCourseClick(course.courseId)} />
                </AnimatedCard>
              ))
            )}
          </Box>
        </AnimatedContainer>
      </Container>
    </PageWrapper>
  );
}
