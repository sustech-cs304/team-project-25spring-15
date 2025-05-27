'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, 
  Typography, 
  Button, 
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar
} from '@mui/material';
import { Course, Lecture, UserInfo } from '@/app/lib/definitions';
import { useStore } from '@/store/useStore';
import AddIcon from '@mui/icons-material/Add';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LectureAPI, CourseAPI } from '@/app/lib/client-api';

interface LectureListProps {
  courseId: number;
}

export default function LectureList({ courseId }: LectureListProps) {
  const router = useRouter();
  const courses = useStore(state => state.courses);
  const userInfo = useStore(state => state.userInfo);
  const setSelectedCourseId = useStore(state => state.setSelectedCourseId);
  const setCourses = useStore(state => state.setCourses);
  
  const [newLecture, setNewLecture] = useState<Partial<Lecture>>({ lectureName: '', description: '', courseId });
  const [openLectureDialog, setOpenLectureDialog] = useState(false);
  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');

  // 获取当前课程信息
  const currentCourse = courses.find(course => course.courseId === courseId);
  const isTeacher = userInfo?.identity === 'teacher' && currentCourse?.teacherId === userInfo.userId;
  
  const handleLectureClick = (lectureId: number) => {
    setSelectedCourseId(courseId);
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
      const list = await CourseAPI.fetchCourses();
      setCourses(list);
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

  if (!currentCourse) {
    return (
      <Container maxWidth="xl">
        <Typography variant="h5" component="h2" gutterBottom>
          课程不存在
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/dashboard')}
        >
          返回课程列表
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/dashboard')}
            sx={{ mr: 2 }}
          >
            返回
          </Button>
          <Typography variant="h4" component="h1">
            {currentCourse.courseName}
          </Typography>
        </Box>
        
        <Box>
          {isTeacher && (
            <>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<PeopleIcon />}
                onClick={handleOpenStudentDialog}
                sx={{ mr: 2 }}
              >
                添加学生
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={handleOpenLectureDialog}
              >
                添加讲座
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" paragraph>
          {currentCourse.description || '暂无课程描述'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Typography variant="body2">
            <strong>开始时间:</strong> {new Date(currentCourse.startTime).toLocaleDateString()}
          </Typography>
          <Typography variant="body2">
            <strong>结束时间:</strong> {new Date(currentCourse.endTime).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>

      {isTeacher && (
        <Button 
          variant="outlined" 
          color="primary" 
          startIcon={<PeopleIcon />}
          onClick={() => router.push(`/dashboard/course/${courseId}/students`)}
          sx={{ mb: 3 }}
        >
          查看所有学生
        </Button>
      )}

      <Typography variant="h5" component="h2" gutterBottom>
        讲座列表
      </Typography>

      {currentCourse.lectures && currentCourse.lectures.length > 0 ? (
        <List>
          {currentCourse.lectures.map((lecture) => (
            <Card key={lecture.lectureId} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => handleLectureClick(lecture.lectureId)}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <AssignmentIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {lecture.lectureName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {lecture.description || '暂无描述'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </List>
      ) : (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" color="textSecondary">
            该课程暂无讲座
          </Typography>
        </Box>
      )}

      {/* 添加讲座对话框 */}
      <Dialog open={openLectureDialog} onClose={handleCloseLectureDialog}>
        <DialogTitle>添加新讲座</DialogTitle>
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
        <DialogActions>
          <Button onClick={handleCloseLectureDialog}>取消</Button>
          <Button onClick={handleAddLecture} variant="contained">添加</Button>
        </DialogActions>
      </Dialog>

      {/* 添加学生对话框 */}
      <Dialog open={openStudentDialog} onClose={handleCloseStudentDialog}>
        <DialogTitle>添加学生到课程</DialogTitle>
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
        <DialogActions>
          <Button onClick={handleCloseStudentDialog}>取消</Button>
          <Button onClick={handleAddStudent} variant="contained">添加</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 