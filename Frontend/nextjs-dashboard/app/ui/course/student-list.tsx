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
  Chip,
} from '@mui/material';
import { UserInfo } from '@/app/lib/definitions';
import { useStore } from '@/store/useStore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SchoolIcon from '@mui/icons-material/School';
import { CourseAPI } from '@/app/lib/client-api';

interface StudentListProps {
  courseId: number;
}

// 这个接口需要根据实际API返回的数据结构调整
interface CourseStudent extends UserInfo {
  enrollmentDate?: string;
  courseIdentity?: string;
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
    const loadData = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        // 获取课程学生列表
        const students = await CourseAPI.getCourseStudents(courseId);
        setStudents(students);
      } catch (error) {
        console.error('获取数据失败', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId]);

  // 对学生列表进行排序：老师 -> 助教 -> 普通学生
  const sortedStudents = [...students].sort((a, b) => {
    // 老师排在最前面
    if (a.userId === currentCourse?.teacherId) return -1;
    if (b.userId === currentCourse?.teacherId) return 1;

    // 助教排在老师后面，普通学生前面
    const aIsTA = a.courseIdentity === 'assistant';
    const bIsTA = b.courseIdentity === 'assistant';

    if (aIsTA && !bIsTA) return -1;
    if (!aIsTA && bIsTA) return 1;

    // 同类型按姓名排序
    return a.userName.localeCompare(b.userName);
  });

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

  const handlePromoteToTA = async (studentId: number) => {
    if (!confirm('确认将此学生设为助教？')) return;

    try {
      // 调用添加助教的API
      await CourseAPI.assignCourseAssistant(courseId, studentId);

      // 重新加载学生列表以获取最新的身份信息
      const updatedStudents = await CourseAPI.getCourseStudents(courseId);
      setStudents(updatedStudents);

      alert('已成功设为助教');
    } catch (error) {
      console.error('设置助教失败', error);
      alert('设置助教失败: ' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  const handleRemoveTA = async (studentId: number) => {
    if (!confirm('确认取消此学生的助教身份？')) return;

    try {
      await CourseAPI.removeCourseAssistant(courseId, studentId);

      const updatedStudents = await CourseAPI.getCourseStudents(courseId);
      setStudents(updatedStudents);

      alert('已成功移除助教');
    } catch (error) {
      console.error('取消助教失败', error);
      alert('取消助教失败');
    }
  };

  const getUserRole = (student: CourseStudent) => {
    if (student.userId === currentCourse?.teacherId) {
      return 'teacher';
    }
    if (student.courseIdentity === 'assistant') {
      return 'ta';
    }
    return 'student';
  };

  const getRoleChip = (role: string) => {
    switch (role) {
      case 'teacher':
        return <Chip label="老师" color="primary" size="small" />;
      case 'ta':
        return <Chip label="助教" color="secondary" size="small" />;
      default:
        return <Chip label="学生" color="default" size="small" />;
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
                <TableCell>身份</TableCell>
                <TableCell>注册时间</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedStudents.length > 0 ? (
                sortedStudents.map((student) => {
                  const role = getUserRole(student);
                  const isCurrentTeacher = student.userId === currentCourse?.teacherId;
                  const isTA = student.courseIdentity === 'assistant';

                  return (
                    <TableRow key={student.userId}>
                      <TableCell>{student.userId}</TableCell>
                      <TableCell>{student.userName}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.university || '-'}</TableCell>
                      <TableCell>{getRoleChip(role)}</TableCell>
                      <TableCell>{student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {/* 只有老师可以看到操作按钮，且不能对自己进行操作 */}
                          {isTeacher && !isCurrentTeacher && (
                            <>
                              {/* 助教管理按钮 */}
                              {isTA ? (
                                <IconButton
                                  color="warning"
                                  onClick={() => handleRemoveTA(student.userId)}
                                  title="取消助教"
                                >
                                  <SchoolIcon />
                                </IconButton>
                              ) : (
                                <IconButton
                                  color="info"
                                  onClick={() => handlePromoteToTA(student.userId)}
                                  title="设为助教"
                                >
                                  <SchoolIcon />
                                </IconButton>
                              )}

                              {/* 删除按钮 */}
                              <IconButton
                                color="error"
                                onClick={() => handleRemoveStudent(student.userId)}
                                title="移除学生"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
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
