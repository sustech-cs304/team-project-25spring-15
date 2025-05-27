'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { UserInfo } from '@/app/lib/definitions';
import { useStore } from '@/store/useStore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { CourseAPI } from '@/app/lib/client-api';

interface StudentListProps {
  courseId: number;
}

// 这个接口需要根据实际API返回的数据结构调整
interface CourseStudent extends UserInfo {
  enrollmentDate?: string;
}

export default function StudentList({ courseId }: StudentListProps) {
  const router = useRouter();
  const userInfo = useStore(state => state.userInfo);
  const courses = useStore(state => state.courses);

  const [students, setStudents] = useState<CourseStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentEmail, setStudentEmail] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const currentCourse = courses.find(course => course.courseId === courseId);
  const isTeacher = userInfo?.identity === 'teacher' && currentCourse?.teacherId === userInfo.userId;

  // 加载学生列表
  useEffect(() => {
    const loadStudents = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        // 假设有一个API来获取课程学生列表
        const students = await CourseAPI.getCourseStudents(courseId);
        setStudents(students);
      } catch (error) {
        console.error('获取学生列表失败', error);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [courseId]);

  const handleAddStudentOpen = () => {
    setOpenAddDialog(true);
  };

  const handleAddStudentClose = () => {
    setOpenAddDialog(false);
    setStudentEmail('');
  };

  const handleAddStudent = async () => {
    if (!studentEmail) return alert('请输入学生邮箱');

    try {
      // 添加学生到课程
      await CourseAPI.addStudentToCourse(courseId, studentEmail);

      // 重新加载学生列表
      const updatedStudents = await CourseAPI.getCourseStudents(courseId);
      setStudents(updatedStudents);

      handleAddStudentClose();
    } catch (error) {
      console.error('添加学生失败', error);
      alert('添加学生失败: ' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    if (!confirm('确认从课程中移除此学生？')) return;

    try {
      // 从课程中移除学生
      await CourseAPI.removeStudentFromCourse(courseId, studentId);

      // 更新本地状态
      setStudents(students.filter(student => student.userId !== studentId));
    } catch (error) {
      console.error('移除学生失败', error);
      alert('移除学生失败');
    }
  };

  if (!isTeacher) {
    router.push(`/dashboard/course/${courseId}`);
    return null;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push(`/dashboard/course/${courseId}`)}
          sx={{ mr: 2 }}
        >
          返回课程
        </Button>
        <Typography variant="h4" component="h1">
          {currentCourse?.courseName} - 学生管理
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          学生列表
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={handleAddStudentOpen}
        >
          添加学生
        </Button>
      </Box>

      {loading ? (
        <Typography>加载中...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>学生ID</TableCell>
                <TableCell>姓名</TableCell>
                <TableCell>邮箱</TableCell>
                <TableCell>学校</TableCell>
                <TableCell>注册时间</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.length > 0 ? (
                students.map((student) => (
                  <TableRow key={student.userId}>
                    <TableCell>{student.userId}</TableCell>
                    <TableCell>{student.userName}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.university || '-'}</TableCell>
                    <TableCell>{student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveStudent(student.userId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    暂无学生
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openAddDialog} onClose={handleAddStudentClose}>
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
          <Button onClick={handleAddStudentClose}>取消</Button>
          <Button onClick={handleAddStudent} variant="contained">添加</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
