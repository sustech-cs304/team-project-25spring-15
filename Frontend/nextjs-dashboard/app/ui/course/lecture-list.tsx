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
  IconButton,
  Menu,
  MenuItem,
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
import MoreVert from '@mui/icons-material/MoreVert';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import { LectureAPI, CourseAPI } from '@/app/lib/client-api';
import { usePermissions } from '@/app/lib/permissions';
import { useMessage } from '@/app/hooks/useMessage';
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

// 讲座卡片组件，带有操作按钮
interface LectureCardProps {
  lecture: Lecture;
  onEdit?: (lecture: Lecture) => void;
  onDelete?: (lecture: Lecture) => void;
  onClick: () => void;
  showActions?: boolean;
}

function LectureCard({ lecture, onEdit, onDelete, onClick, showActions = false }: LectureCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleMenuClose();
    onEdit?.(lecture);
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleMenuClose();
    onDelete?.(lecture);
  };

  return (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        position: 'relative',
        '&:hover': {
          background: 'rgba(255, 255, 255, 1)',
        },
      }}
    >
      {/* 操作菜单按钮 */}
      {showActions && (onEdit || onDelete) && (
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(4px)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {onEdit && (
              <MenuItem onClick={handleEdit}>
                <Edit fontSize="small" sx={{ mr: 1 }} />
                编辑讲座
              </MenuItem>
            )}
            {onDelete && (
              <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                <Delete fontSize="small" sx={{ mr: 1 }} />
                删除讲座
              </MenuItem>
            )}
          </Menu>
        </Box>
      )}

      <div onClick={onClick}>
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
      </div>
    </Card>
  );
}

export default function LectureList({ courseId }: LectureListProps) {
  const router = useRouter();
  const courses = useStore(state => state.courses);
  const userInfo = useStore(state => state.userInfo);
  const setSelectedCourseId = useStore(state => state.setSelectedCourseId);
  const setSelectedLectureId = useStore(state => state.setSelectedLectureId);
  const setCourses = useStore(state => state.setCourses);
  const courseIdentity = useStore(state => state.courseIdentity);
  const setCourseIdentity = useStore(state => state.setCourseIdentity);

  const [newLecture, setNewLecture] = useState<Partial<Lecture>>({ lectureName: '', description: '', courseId });
  const [openLectureDialog, setOpenLectureDialog] = useState(false);
  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

  // 编辑讲座相关状态
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [editForm, setEditForm] = useState({
    lectureName: '',
    description: '',
  });

  // 使用消息弹窗
  const { success, error, warning, confirm, MessageComponent } = useMessage();

  // 获取当前课程和讲座信息
  useEffect(() => {
    const loadCourseAndLectures = async () => {
      setLoading(true);
      try {
        // 直接从后端获取课程详情和讲座列表
        console.log('开始加载课程数据，courseId:', courseId);
        const response = await CourseAPI.fetchCourseWithLectures(courseId);
        
        console.log('API响应:', response);
        
        if (!response || !response.course) {
          throw new Error('API返回的数据格式不正确');
        }
        
        const course = response.course;
        const identity = response.courseIdentity;

        console.log('成功加载课程:', course);
        console.log('用户在课程中的身份:', identity);

        setCurrentCourse(course);
        setCourseIdentity(identity);

        // 同时更新store中的courses数据（如果需要的话）
        const existingCourseIndex = courses.findIndex(c => c.courseId === courseId);
        if (existingCourseIndex >= 0) {
          const updatedCourses = [...courses];
          updatedCourses[existingCourseIndex] = course;
          setCourses(updatedCourses);
        } else {
          // 如果courses中没有这个课程，添加进去
          setCourses([...courses, course]);
        }
      } catch (error) {
        console.error('主要API调用失败:', error);
        
        // 记录详细的错误信息
        if (error instanceof Error) {
          console.error('错误详情:', error.message);
        }
        
        // 尝试多种fallback策略
        console.log('尝试fallback策略...');
        
        // 策略1: 从store中查找课程
        const fallbackCourse = courses.find(c => c.courseId === courseId);
        if (fallbackCourse) {
          console.log('使用store中的课程作为fallback:', fallbackCourse);
          setCurrentCourse(fallbackCourse);
          setCourseIdentity(null); // 无法获取身份，设为null
          return;
        }
        
        // 策略2: 尝试单独获取讲座列表（如果有单独的API）
        try {
          console.log('尝试使用旧的API获取讲座列表...');
          const lectures = await LectureAPI.fetchLecturesByCourse(courseId);
          if (lectures && lectures.length > 0 && lectures[0].courseId) {
            // 从讲座数据中构造一个基本的课程对象
            const basicCourse = {
              courseId: courseId,
              courseName: "课程信息加载中...",
              description: "正在尝试获取课程详情...",
              lectures: lectures,
              startTime: new Date().toISOString(),
              endTime: new Date().toISOString(),
              teacherId: 0,
              chatId: 0
            };
            console.log('使用基础课程对象:', basicCourse);
            setCurrentCourse(basicCourse);
            setCourseIdentity(null);
            return;
          }
        } catch (lectureError) {
          console.error('获取讲座列表也失败了:', lectureError);
        }
        
        // 如果所有fallback都失败了，保持currentCourse为null，会显示错误页面
        console.error('所有fallback策略都失败了');
        setCurrentCourse(null);
        setCourseIdentity(null);
      } finally {
        setLoading(false);
      }
    };

    loadCourseAndLectures();
  }, [courseId, setCourseIdentity, setCourses]);

  // 使用权限管理工具
  const permissions = usePermissions(userInfo, currentCourse?.teacherId, courseIdentity);

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

  // 处理编辑讲座
  const handleEditLecture = (lecture: Lecture) => {
    setEditingLecture(lecture);
    setEditForm({
      lectureName: lecture.lectureName,
      description: lecture.description || '',
    });
    setEditDialogOpen(true);
  };

  // 处理删除讲座
  const handleDeleteLecture = async (lecture: Lecture) => {
    if (!permissions.canManageCourse) {
      warning('您没有权限删除讲座');
      return;
    }

    confirm(
      `确认删除讲座"${lecture.lectureName}"？\n\n删除后将无法恢复，所有相关的作业和内容都将被删除。`,
      async () => {
        try {
          await LectureAPI.deleteLecture(courseId, lecture.lectureId);
          
          // 重新加载讲座列表
          const response = await CourseAPI.fetchCourseWithLectures(courseId);
          const updatedCourse = response.course;

          if (updatedCourse) {
            // 更新本地状态
            setCurrentCourse(updatedCourse);

            // 更新store中的课程数据
            const existingCourseIndex = courses.findIndex(c => c.courseId === courseId);
            if (existingCourseIndex >= 0) {
              const updatedCourses = [...courses];
              updatedCourses[existingCourseIndex] = updatedCourse;
              setCourses(updatedCourses);
            }
          }
          
          success(`讲座"${lecture.lectureName}"已成功删除`, {
            title: '删除成功'
          });
        } catch (err) {
          console.error('删除讲座失败:', err);
          error('删除讲座失败: ' + (err instanceof Error ? err.message : '未知错误'));
        }
      }
    );
  };

  // 处理保存编辑
  const handleSaveEdit = async () => {
    if (!editingLecture || !currentCourse) return;
    
    if (!editForm.lectureName.trim()) {
      warning('请输入讲座名称');
      return;
    }

    try {
      await LectureAPI.updateLecture(
        currentCourse.chatId, 
        courseId, 
        editingLecture.lectureId, 
        {
          lectureName: editForm.lectureName.trim(),
          description: editForm.description.trim(),
        }
      );

      // 重新加载讲座列表
      const response = await CourseAPI.fetchCourseWithLectures(courseId);
      const updatedCourse = response.course;

      if (updatedCourse) {
        // 更新本地状态
        setCurrentCourse(updatedCourse);

        // 更新store中的课程数据
        const existingCourseIndex = courses.findIndex(c => c.courseId === courseId);
        if (existingCourseIndex >= 0) {
          const updatedCourses = [...courses];
          updatedCourses[existingCourseIndex] = updatedCourse;
          setCourses(updatedCourses);
        }
      }

      success(`讲座"${editForm.lectureName}"已成功更新`, {
        title: '更新成功'
      });
      
      setEditDialogOpen(false);
      setEditingLecture(null);
    } catch (err) {
      console.error('更新讲座失败:', err);
      error('更新讲座失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditDialogOpen(false);
    setEditingLecture(null);
    setEditForm({ lectureName: '', description: '' });
  };

  const handleAddLecture = async () => {
    if (!newLecture.lectureName) return alert('请输入讲座名称');
    if (!permissions.canManageCourse) return alert('您没有权限添加讲座');
    
    try {
      await LectureAPI.addLecture(courseId, {
        lectureName: newLecture.lectureName,
        description: newLecture.description || ''
      });

      // 重新加载讲座列表
      const response = await CourseAPI.fetchCourseWithLectures(courseId);
      const updatedCourse = response.course;

      if (updatedCourse) {
        // 更新本地状态
        setCurrentCourse(updatedCourse);

        // 更新store中的课程数据
        const existingCourseIndex = courses.findIndex(c => c.courseId === courseId);
        if (existingCourseIndex >= 0) {
          const updatedCourses = [...courses];
          updatedCourses[existingCourseIndex] = updatedCourse;
          setCourses(updatedCourses);
        }
      }

      handleCloseLectureDialog();
    } catch (error) {
      console.error('添加讲座失败', error);
      alert('添加讲座失败');
    }
  };

  const handleAddStudent = async () => {
    if (!studentEmail) return alert('请输入学生邮箱');
    if (!permissions.canManageCourse) return alert('您没有权限添加学生');
    
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
                课程加载失败
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                无法加载课程ID为 {courseId} 的课程信息
              </Typography>
              
              {/* 诊断信息 */}
              <Box sx={{ textAlign: 'left', mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>诊断信息：</Typography>
                <Typography variant="body2" color="text.secondary">
                  • 课程ID: {courseId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • 用户身份: {userInfo?.identity || '未知'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • 用户ID: {userInfo?.userId || '未知'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Store中的课程数量: {courses.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • 请检查浏览器控制台以获取详细错误信息
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => router.push('/dashboard')}
                >
                  返回课程列表
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    console.log('强制重新加载课程数据');
                    window.location.reload();
                  }}
                >
                  重新加载页面
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    console.log('当前状态诊断:');
                    console.log('courseId:', courseId);
                    console.log('userInfo:', userInfo);
                    console.log('courses in store:', courses);
                    console.log('courseIdentity:', courseIdentity);
                    alert('诊断信息已输出到控制台，请按F12查看');
                  }}
                >
                  输出诊断信息
                </Button>
              </Box>
            </Paper>
          </FadeIn>
        </Container>
      </PageWrapper>
    );
  }

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
            height: '50vh',
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

              {permissions.canManageCourse && (
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
                  {/* 删除课程按钮 - 只有教师可以删除 */}
                  {permissions.isTeacher && (
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 1)',
                        },
                      }}
                    >
                      删除课程
                    </Button>
                  )}
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
            {currentCourse?.lectures && currentCourse.lectures.length > 0 ? (
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
                    <LectureCard
                      lecture={lecture}
                      onClick={() => handleLectureClick(lecture.lectureId)}
                      onEdit={handleEditLecture}
                      onDelete={handleDeleteLecture}
                      showActions={permissions.canManageCourse}
                    />
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
                    {permissions.canManageCourse ? '点击上方按钮添加第一个讲座' : '请等待老师添加讲座内容'}
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

          {/* 编辑讲座对话框 */}
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
              编辑讲座
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="讲座名称"
                type="text"
                fullWidth
                variant="outlined"
                value={editForm.lectureName}
                onChange={(e) => setEditForm({ ...editForm, lectureName: e.target.value })}
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
        </Container>
      </Box>
    </PageWrapper>
  );
}
 