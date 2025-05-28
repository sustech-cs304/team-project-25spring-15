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
  Card,
  CardContent,
} from '@mui/material';

import MarkdownEditor from "@/app/ui/note/MarkdownEditor";
import CodeIDE from "@/app/ui/note/CodeIDE";
import { useStore } from '@/store/useStore';
import CourseCard from './cards';
import AddIcon from '@mui/icons-material/Add';
import SchoolIcon from '@mui/icons-material/School';
import NoteIcon from '@mui/icons-material/Note';
import CodeIcon from '@mui/icons-material/Code';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { PageWrapper, AnimatedContainer, AnimatedCard, FadeIn, LoadingSpinner } from '@/app/ui/animations';
import { useTheme } from '@mui/material/styles';

export default function CourseList() {
  const router = useRouter();
  const courses = useStore(state => state.courses);
  const userInfo = useStore(state => state.userInfo);
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const [note, setNote] = useState("# 这里是你的笔记...");

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCourseClick = (courseId: number) => {
    router.push(`/dashboard/course/${courseId}`);
  };

  // 根据用户身份筛选我的课程
  const myCourses = Array.isArray(courses)
    ? courses.filter(course => {
        if (!course) return false;
        if (userInfo?.identity === 'teacher') {
          return course.teacherId === userInfo.userId;
        } else {
          // 学生的课程（这里暂时显示所有课程，实际应该根据学生注册情况筛选）
          return true;
        }
      })
    : [];

  // 渲染统计信息卡片
  const renderStatsCards = () => {
    if (tabValue !== 0) return null;

    return (
      <FadeIn delay={0.3}>
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          {/* 总课程数统计 */}
          <Card
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              minWidth: 200,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100px',
                height: '100px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                transform: 'translate(30px, -30px)',
              },
            }}
          >
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LibraryBooksIcon sx={{ fontSize: 32, opacity: 0.9 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {myCourses.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    门课程
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* 教师创建的课程统计 */}
          {userInfo?.identity === 'teacher' && (
            <Card
              sx={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                minWidth: 200,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '80px',
                  height: '80px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '50%',
                  transform: 'translate(20px, -20px)',
                },
              }}
            >
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TrendingUpIcon sx={{ fontSize: 32, opacity: 0.9 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {courses?.filter(c => c.teacherId === userInfo.userId).length || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      我创建的课程
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* 学习进度统计（学生专用） */}
          {userInfo?.identity === 'student' && (
            <Card
              sx={{
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white',
                minWidth: 200,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '90px',
                  height: '90px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  transform: 'translate(25px, -25px)',
                },
              }}
            >
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TrendingUpIcon sx={{ fontSize: 32, opacity: 0.9 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                      85%
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      平均进度
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </FadeIn>
    );
  };

  // 渲染不同标签页的内容
  const renderTabContent = () => {
    switch (tabValue) {
      case 0: // 我的课程
        return (
          <Box>
            {/* 统计信息卡片 */}
            {renderStatsCards()}

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
                {!Array.isArray(courses) ? (
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
                ) : myCourses.length === 0 ? (
                  // 空状态
                  <FadeIn delay={0.5}>
                    <Paper
                      sx={{
                        gridColumn: '1 / -1',
                        p: 8,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: 3,
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
                  myCourses.map((course, index) => (
                    <AnimatedCard
                      key={course.courseId}
                      delay={0.4 + index * 0.1}
                      onClick={() => handleCourseClick(course.courseId)}
                    >
                      <CourseCard course={course} onClick={() => handleCourseClick(course.courseId)} />
                    </AnimatedCard>
                  ))
                )}
              </Box>
            </AnimatedContainer>
          </Box>
        );

      case 1: // 笔记
        return (
          <FadeIn delay={0.3}>
            <Paper
              sx={{
                p: 8,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 3,
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MarkdownEditor value={note} onChange={setNote} />
            </Paper>
          </FadeIn>
        );

      case 2: // IDE
        return (
          <FadeIn delay={0.3}>
            <Paper
              sx={{
                p: 8,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 3,
                minHeight: '650px',
                display: 'flex',
                flexDirection: 'column',
                flex: 1, // 新增，让 Paper 占满可用空间
              }}
            >
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <CodeIDE />
              </Box>
            </Paper>
          </FadeIn>
        );

      default:
        return null;
    }
  };

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
                  // 响应式字号：小屏 2rem，大屏 3rem
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 800,
                  // 渐变文字效果
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  // 微微加宽字距
                  letterSpacing: '0.05em',
                  // 下方留白
                  mb: 1.5,
                }}
              >
                智能学习平台
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  // 用主题的灰色作为文字色
                  color: theme.palette.text.secondary,
                  fontWeight: 400,
                  // 斜体更显轻盈
                  fontStyle: 'italic',
                  // 响应式字号：小屏 1rem，大屏 1.25rem
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  lineHeight: 1.6,
                }}
              >
                探索知识的海洋，开启学习之旅
              </Typography>
            </Box>

            {userInfo?.identity === 'teacher' && tabValue === 0 && (
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
                  borderRadius: 2,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)',
                  },
                }}
              >
                新建课程
              </Button>
            )}
          </Box>
        </FadeIn>

        {/* 主要内容区域 */}
        <FadeIn delay={0.2}>
          <Box sx={{ display: 'flex', gap: 3, minHeight: '600px' }}>
            {/* 侧边标签页 */}
            <Paper
              elevation={0}
              sx={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                overflow: 'hidden',
                width: 280,
                flexShrink: 0,
                height: 'fit-content',
              }}
            >
              <Tabs
                orientation="vertical"
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    minHeight: 64,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    px: 3,
                    py: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.08)',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    width: 4,
                    borderRadius: '0 4px 4px 0',
                    background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                  },
                }}
              >
                <Tab
                  icon={<SchoolIcon sx={{ fontSize: 24 }} />}
                  label="我的课程"
                  iconPosition="start"
                  sx={{ gap: 2, justifyContent: 'flex-start' }}
                />
                <Tab
                  icon={<NoteIcon sx={{ fontSize: 24 }} />}
                  label="笔记"
                  iconPosition="start"
                  sx={{ gap: 2, justifyContent: 'flex-start' }}
                />
                <Tab
                  icon={<CodeIcon sx={{ fontSize: 24 }} />}
                  label="IDE"
                  iconPosition="start"
                  sx={{ gap: 2, justifyContent: 'flex-start' }}
                />
              </Tabs>
            </Paper>

            {/* 主要内容区域 */}
            <Box sx={{ flexGrow: 1 }}>
              {renderTabContent()}
            </Box>
          </Box>
        </FadeIn>
      </Container>
    </PageWrapper>
  );
}
