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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
import { CourseAPI } from '@/app/lib/client-api';
import { Course } from '@/app/lib/definitions';
import { usePermissions } from '@/app/lib/permissions';
import { useMessage } from '@/app/hooks/useMessage';

export default function CourseList() {
  const router = useRouter();
  const courses = useStore(state => state.courses);
  const setCourses = useStore(state => state.setCourses);
  const userInfo = useStore(state => state.userInfo);
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const [note, setNote] = useState("# 这里是你的笔记...");

  // 编辑课程相关状态
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editForm, setEditForm] = useState({
    courseName: '',
    description: '',
  });

  // 使用消息弹窗
  const { success, error, warning, confirm, MessageComponent } = useMessage();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCourseClick = (courseId: number) => {
    router.push(`/dashboard/course/${courseId}`);
  };

  // 处理编辑课程
  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setEditForm({
      courseName: course.courseName,
      description: course.description || '',
    });
    setEditDialogOpen(true);
  };

  // 处理删除课程
  const handleDeleteCourse = async (course: Course) => {
    if (!userInfo) {
      warning('用户信息不存在');
      return;
    }

    // 检查权限：只有课程创建者可以删除
    if (course.teacherId !== userInfo.userId) {
      warning('只有课程创建者可以删除课程');
      return;
    }

    confirm(
      `确认删除课程"${course.courseName}"？\n\n删除后将无法恢复，所有相关的讲座和内容都将被删除。`,
      async () => {
        try {
          await CourseAPI.deleteCourse(course.courseId);
          
          // 更新本地状态
          const updatedCourses = courses.filter(c => c.courseId !== course.courseId);
          setCourses(updatedCourses);
          
          success(`课程"${course.courseName}"已成功删除`, {
            title: '删除成功'
          });
        } catch (err) {
          console.error('删除课程失败:', err);
          error('删除课程失败: ' + (err instanceof Error ? err.message : '未知错误'));
        }
      }
    );
  };

  // 处理保存编辑
  const handleSaveEdit = async () => {
    if (!editingCourse) return;
    
    if (!editForm.courseName.trim()) {
      warning('请输入课程名称');
      return;
    }

    try {
      await CourseAPI.updateCourse(editingCourse.courseId, {
        courseName: editForm.courseName.trim(),
        description: editForm.description.trim(),
      });

      // 更新本地状态
      const updatedCourses = courses.map(course => 
        course.courseId === editingCourse.courseId 
          ? { ...course, courseName: editForm.courseName.trim(), description: editForm.description.trim() }
          : course
      );
      setCourses(updatedCourses);

      success(`课程"${editForm.courseName}"已成功更新`, {
        title: '更新成功'
      });
      
      setEditDialogOpen(false);
      setEditingCourse(null);
    } catch (err) {
      console.error('更新课程失败:', err);
      error('更新课程失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditDialogOpen(false);
    setEditingCourse(null);
    setEditForm({ courseName: '', description: '' });
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
                      <CourseCard 
                        course={course} 
                        onClick={() => handleCourseClick(course.courseId)}
                        onEdit={handleEditCourse}
                        onDelete={handleDeleteCourse}
                        showActions={userInfo?.identity === 'teacher' && course.teacherId === userInfo.userId}
                      />
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
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        {/* 背景渐变 */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '40vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            zIndex: 0,
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
                    // 白色渐变，从不透明到半透明
                    background: `linear-gradient(45deg, ${alpha('#ffffff', 1)}, ${alpha('#ffffff', 0.7)})`,
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
                    // 半透明白色
                    color: alpha('#ffffff', 0.8),
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

        {/* 编辑课程对话框 */}
        <Dialog 
          open={editDialogOpen} 
          onClose={handleCancelEdit}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, fontSize: '1.5rem' }}>
            编辑课程
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="课程名称"
              type="text"
              fullWidth
              variant="outlined"
              value={editForm.courseName}
              onChange={(e) => setEditForm({ ...editForm, courseName: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="课程描述"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button onClick={handleCancelEdit} variant="outlined">
              取消
            </Button>
            <Button onClick={handleSaveEdit} variant="contained">
              保存
            </Button>
          </DialogActions>
        </Dialog>

        {/* 消息弹窗 */}
        <MessageComponent />
      </Box>
    </PageWrapper>
  );
}
