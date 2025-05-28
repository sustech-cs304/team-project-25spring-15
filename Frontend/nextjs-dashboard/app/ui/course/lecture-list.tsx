'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Chip,
  Paper,
  Grid,
  alpha,
  LinearProgress,
} from '@mui/material';
import { Course, Lecture, UserInfo } from '@/app/lib/definitions';
import { useStore } from '@/store/useStore';
import AddIcon from '@mui/icons-material/Add';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayCircleOutline from '@mui/icons-material/PlayCircleOutline';
import CalendarToday from '@mui/icons-material/CalendarToday';
import AccessTime from '@mui/icons-material/AccessTime';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { LectureAPI, CourseAPI } from '@/app/lib/client-api';
import { 
  PageWrapper, 
  AnimatedContainer, 
  AnimatedCard, 
  FadeIn, 
  SlideIn,
  LoadingSpinner 
} from '@/app/ui/animations';

interface LectureListProps {
  courseId: number;
}

export default function LectureList({ courseId }: LectureListProps) {
  const router = useRouter();
  const courses = useStore(state => state.courses);
  const userInfo = useStore(state => state.userInfo);
  const setSelectedCourseId = useStore(state => state.setSelectedCourseId);
  const setSelectedLectureId = useStore(state => state.setSelectedLectureId);
  const setCourses = useStore(state => state.setCourses);

  const [newLecture, setNewLecture] = useState<Partial<Lecture>>({ lectureName: '', description: '', courseId });
  const [openLectureDialog, setOpenLectureDialog] = useState(false);
  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

  // 获取当前课程和讲座信息
  useEffect(() => {
    const loadCourseAndLectures = async () => {
      setLoading(true);
      try {
        // 先从store中查找课程
        const course = courses.find(c => c.courseId === courseId);

        if (course) {
          // 如果课程已经有讲座数据，直接使用
          if (course.lectures && course.lectures.length > 0) {
            setCurrentCourse(course);
          } else {
            // 否则加载讲座数据
            const lectures = await LectureAPI.fetchLecturesByCourse(courseId);
            const updatedCourse = { ...course, lectures: lectures || [] };
            setCurrentCourse(updatedCourse);

            // 更新store中的课程数据，但不触发useEffect重新执行
            const updatedCourses = courses.map(c =>
              c.courseId === courseId ? updatedCourse : c
            );
            // 使用setTimeout来避免在当前渲染周期中触发状态更新
            setTimeout(() => {
              setCourses(updatedCourses);
            }, 0);
          }
        } else {
          // 如果在store中找不到课程，直接加载
          console.warn('Course not found in store, loading directly');
          try {
            // 尝试直接从API获取课程信息
            // 因为没有实现fetchCourseById方法，暂时使用一个空对象
            const fetchedCourse = {
              courseId,
              courseName: "未知课程",
              description: "正在加载...",
              lectures: [],
              startTime: new Date().toISOString(),
              endTime: new Date().toISOString(),
              teacherId: 0,
              chatId: 0
            };

            const lectures = await LectureAPI.fetchLecturesByCourse(courseId);
            const fullCourse = { ...fetchedCourse, lectures: lectures || [] };
            setCurrentCourse(fullCourse);
          } catch (error) {
            console.error('直接获取课程信息失败:', error);
          }
        }
      } catch (error) {
        console.error('加载课程或讲座失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourseAndLectures();
  // 只依赖于courseId，不依赖于courses和setCourses
  }, [courseId]);

  const isTeacher = userInfo?.identity === 'teacher' && currentCourse?.teacherId === userInfo.userId;

  const handleLectureClick = (lectureId: number) => {
    setSelectedCourseId(courseId);
    setSelectedLectureId(lectureId);
    router.push(`/dashboard/${courseId}/${lectureId}`);
  };

  const handleOpenLectureDialog = () => {
    setOpenLectureDialog(true);
  };

  const handleCloseLectureDialog = () => {
    setOpenLectureDialog(false);
    setNewLecture({ lectureName: '', description: '', courseId });
  };

  const handleOpenStudentDialog = () => {
    setOpenStudentDialog(true);
  };

  const handleCloseStudentDialog = () => {
    setOpenStudentDialog(false);
    setStudentEmail('');
  };

  const handleAddLecture = async () => {
    if (!newLecture.lectureName) return alert('请输入讲座名称');
    try {
      await LectureAPI.addLecture(courseId, {
        lectureName: newLecture.lectureName,
        description: newLecture.description || ''
      });

      // 重新加载讲座列表
      const lectures = await LectureAPI.fetchLecturesByCourse(courseId);

      if (currentCourse) {
        const updatedCourse = { ...currentCourse, lectures: lectures || [] };
        // 先更新本地状态
        setCurrentCourse(updatedCourse);

        // 使用setTimeout延迟更新全局状态，避免在当前渲染周期中触发useEffect
        setTimeout(() => {
          // 更新store中的课程数据
          const updatedCourses = courses.map(c =>
            c.courseId === courseId ? updatedCourse : c
          );
          setCourses(updatedCourses);
        }, 0);
      }

      handleCloseLectureDialog();
    } catch (error) {
      console.error('添加讲座失败', error);
      alert('添加讲座失败');
    }
  };

  const handleAddStudent = async () => {
    if (!studentEmail) return alert('请输入学生邮箱');
    try {
      // 这里需要添加调用后端 API 添加学生的代码
      await CourseAPI.addStudentToCourse(courseId, studentEmail);
      alert('添加学生成功');
      handleCloseStudentDialog();
    } catch (error) {
      console.error('添加学生失败', error);
      alert('添加学生失败');
    }
  };

  // 计算课程进度
  const totalLectures = currentCourse?.lectures?.length || 0;
  const completedLectures = currentCourse?.lectures?.filter(lecture => lecture.status === 'done').length || 0;
  const progress = totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;

  if (loading) {
    return (
      <PageWrapper>
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '60vh',
            gap: 3
          }}>
            <LoadingSpinner />
            <Typography variant="h5" color="text.secondary">
              正在加载课程信息...
            </Typography>
          </Box>
        </Container>
      </PageWrapper>
    );
  }

  if (!currentCourse) {
    return (
      <PageWrapper>
        <Container maxWidth="xl">
          <FadeIn>
            <Paper sx={{ p: 6, textAlign: 'center', mt: 4 }}>
              <Typography variant="h4" color="error" gutterBottom>
                课程不存在
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                抱歉，找不到您要访问的课程
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push('/dashboard')}
              >
                返回课程列表
              </Button>
            </Paper>
          </FadeIn>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* 背景渐变 */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '50vh',
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
            alignItems: 'flex-start', 
            mb: 4,
            pt: 4,
            flexWrap: 'wrap',
            gap: 2,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push('/dashboard')}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                  },
                }}
              >
                返回
              </Button>
              <Box>
                <Typography 
                  variant="h3" 
                  component="h1"
                  sx={{ 
                    color: 'white',
                    fontWeight: 700,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    mb: 1,
                  }}
                >
                  {currentCourse.courseName}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Chip
                    icon={<PlayCircleOutline />}
                    label={`${totalLectures} 讲座`}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: 'text.primary',
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    icon={<CheckCircle />}
                    label={`${Math.round(progress)}% 完成`}
                    color={progress === 100 ? 'success' : 'primary'}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {isTeacher && (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<PeopleIcon />}
                  onClick={() => router.push(`/dashboard/course/${courseId}/students`)}
                  sx={{
                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
                    },
                  }}
                >
                  管理学生
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenLectureDialog}
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2196F3 60%, #21CBF3 100%)',
                    },
                  }}
                >
                  添加讲座
                </Button>
              </Box>
            )}
          </Box>
        </FadeIn>

        {/* 课程信息卡片 */}
        <SlideIn delay={0.2} direction="up">
          <Paper
            elevation={0}
            sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              p: 4,
              mb: 4,
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  课程描述
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                  {currentCourse.description || '暂无课程描述'}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      开始时间: {new Date(currentCourse.startTime).toLocaleDateString('zh-CN')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      结束时间: {new Date(currentCourse.endTime).toLocaleDateString('zh-CN')}
                    </Typography>
                  </Box>
                  {totalLectures > 0 && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        课程进度: {completedLectures}/{totalLectures}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: alpha('#2563eb', 0.2),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                          },
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Paper>
        </SlideIn>

        {/* 讲座列表 */}
        <FadeIn delay={0.3}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ 
            fontWeight: 700,
            color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            mb: 3,
          }}>
            讲座列表
          </Typography>
        </FadeIn>

        <AnimatedContainer>
          {currentCourse.lectures && currentCourse.lectures.length > 0 ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 3,
              }}
            >
              {currentCourse.lectures.map((lecture, index) => (
                <AnimatedCard
                  key={lecture.lectureId}
                  delay={index * 0.1}
                  onClick={() => handleLectureClick(lecture.lectureId)}
                >
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 1)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'primary.main',
                            width: 48,
                            height: 48,
                          }}
                        >
                          <AssignmentIcon />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {lecture.lectureName}
                          </Typography>
                          <Chip
                            label={lecture.status === 'done' ? '已完成' : lecture.status === 'inProgress' ? '进行中' : '未开始'}
                            color={lecture.status === 'done' ? 'success' : lecture.status === 'inProgress' ? 'primary' : 'default'}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.5,
                        }}
                      >
                        {lecture.description || '暂无描述'}
                      </Typography>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              ))}
            </Box>
          ) : (
            <FadeIn delay={0.4}>
              <Paper
                sx={{
                  p: 8,
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '2px dashed',
                  borderColor: 'divider',
                }}
              >
                <MenuBookIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  该课程暂无讲座
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {isTeacher ? '点击上方按钮添加第一个讲座' : '请等待老师添加讲座内容'}
                </Typography>
              </Paper>
            </FadeIn>
          )}
        </AnimatedContainer>

        {/* 添加讲座对话框 */}
        <Dialog 
          open={openLectureDialog} 
          onClose={handleCloseLectureDialog}
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
            添加新讲座
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="讲座名称"
              type="text"
              fullWidth
              variant="outlined"
              value={newLecture.lectureName}
              onChange={(e) => setNewLecture({ ...newLecture, lectureName: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="讲座描述"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={newLecture.description}
              onChange={(e) => setNewLecture({ ...newLecture, description: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button onClick={handleCloseLectureDialog} variant="outlined">
              取消
            </Button>
            <Button onClick={handleAddLecture} variant="contained">
              添加讲座
            </Button>
          </DialogActions>
        </Dialog>

        {/* 添加学生对话框 */}
        <Dialog 
          open={openStudentDialog} 
          onClose={handleCloseStudentDialog}
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
            添加学生到课程
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="学生邮箱"
              type="email"
              fullWidth
              variant="outlined"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button onClick={handleCloseStudentDialog} variant="outlined">
              取消
            </Button>
            <Button onClick={handleAddStudent} variant="contained">
              添加学生
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </PageWrapper>
  );
}
