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
import { usePermissions } from '@/app/lib/permissions';
import { useMessage } from '@/app/hooks/useMessage';

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
  const courseIdentity = useStore(state => state.courseIdentity);

  const [students, setStudents] = useState<CourseStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentEmail, setStudentEmail] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const currentCourse = courses.find(course => course.courseId === courseId);

  // 使用权限管理工具
  const permissions = usePermissions(userInfo, currentCourse?.teacherId, courseIdentity);
  
  // 使用消息弹窗
  const { success, error, warning, confirm, MessageComponent } = useMessage();

  // 权限检查：只有教师和助教可以管理学生
  useEffect(() => {
    if (!permissions.canManageStudents) {
      console.log('用户没有管理学生的权限，重定向到课程页面');
      router.push(`/dashboard/course/${courseId}`);
      return;
    }
  }, [permissions.canManageStudents, router, courseId]);

  // 加载学生列表
  useEffect(() => {
    const loadData = async () => {
      if (!courseId || !permissions.canManageStudents) return;

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
  }, [courseId, permissions.canManageStudents]);

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
    if (!studentEmail) {
      warning('请输入成员邮箱');
      return;
    }
    if (!permissions.canManageStudents) {
      warning('您没有权限添加成员');
      return;
    }

    try {
      // 添加学生到课程
      await CourseAPI.addStudentToCourse(courseId, studentEmail);

      // 重新加载学生列表
      const updatedStudents = await CourseAPI.getCourseStudents(courseId);
      setStudents(updatedStudents);

      success(`🎉 成功添加成员到课程！\n\n邮箱: ${studentEmail}`, {
        title: '添加成功'
      });
      handleAddStudentClose();
    } catch (err) {
      console.error('添加学生失败', err);
      error('添加成员失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    if (!permissions.canManageStudents) {
      warning('您没有权限移除成员');
      return;
    }
    
    confirm("确认从课程中移除此成员？", async () => {
      try {
        // 从课程中移除学生
        await CourseAPI.removeStudentFromCourse(courseId, studentId);

        // 更新本地状态
        setStudents(students.filter(student => student.userId !== studentId));
        
        success('成员已成功移除');
      } catch (err) {
        console.error('移除学生失败', err);
        error('移除成员失败');
      }
    });
  };

  const handlePromoteToTA = async (studentId: number) => {
    if (!permissions.isTeacher) {
      warning('只有教师可以设置助教');
      return;
    }
    
    confirm("确认将此成员设为助教？", async () => {
      try {
        // 调用添加助教的API
        await CourseAPI.assignCourseAssistant(courseId, studentId);

        // 重新加载学生列表以获取最新的身份信息
        const updatedStudents = await CourseAPI.getCourseStudents(courseId);
        setStudents(updatedStudents);

        const studentName = students.find(s => s.userId === studentId)?.userName || '该成员';
        success(`🎓 ${studentName} 已成功设为助教！\n\n现在拥有助教权限，可以协助管理课程。`, {
          title: '设置助教成功'
        });
      } catch (err) {
        console.error('设置助教失败', err);
        error('设置助教失败: ' + (err instanceof Error ? err.message : '未知错误'));
      }
    });
  };

  const handleRemoveTA = async (studentId: number) => {
    if (!permissions.isTeacher) {
      warning('只有教师可以取消助教身份');
      return;
    }
    
    confirm("确认取消此成员的助教身份？", async () => {
      try {
        await CourseAPI.removeCourseAssistant(courseId, studentId);

        const updatedStudents = await CourseAPI.getCourseStudents(courseId);
        setStudents(updatedStudents);

        const studentName = students.find(s => s.userId === studentId)?.userName || '该成员';
        success(`${studentName} 的助教身份已成功移除`, {
          title: '移除助教成功'
        });
      } catch (err) {
        console.error('取消助教失败', err);
        error('取消助教失败');
      }
    });
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

  if (!permissions.canManageStudents) {
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
            权限不足
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          您没有管理学生的权限，正在重定向...
        </Typography>
      </Container>
    );
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
        <Box>
          <Typography variant="h4" component="h1">
            {currentCourse?.courseName} - 课程成员管理
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {permissions.isTeacher ? '教师' : '助教'}权限
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          成员列表 ({sortedStudents.length} 人)
        </Typography>
        {permissions.canManageStudents && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={handleAddStudentOpen}
          >
            添加成员
          </Button>
        )}
      </Box>

      {loading ? (
        <Typography>加载中...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>成员ID</TableCell>
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
                      <TableCell>{student.email}</TableCell>
                      <TableCell>南方科技大学</TableCell>
                      <TableCell>{getRoleChip(role)}</TableCell>
                      <TableCell>{new Date().toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {/* 有管理权限的用户可以看到操作按钮，但不能对自己进行操作 */}
                          {permissions.canManageStudents && !isCurrentTeacher && (
                            <>
                              {/* 助教管理按钮 - 只有教师可以管理助教 */}
                              {permissions.isTeacher && (
                                <>
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
                                </>
                              )}

                              {/* 删除按钮 - 教师和助教都可以移除普通学生 */}
                              <IconButton
                                color="error"
                                onClick={() => handleRemoveStudent(student.userId)}
                                title="移除成员"
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
        <DialogTitle>添加成员到课程</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="成员邮箱"
            type="email"
            fullWidth
            variant="outlined"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            placeholder="请输入要添加的成员邮箱"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddStudentClose}>取消</Button>
          <Button onClick={handleAddStudent} variant="contained">添加</Button>
        </DialogActions>
      </Dialog>
      
      {/* 消息弹窗 */}
      <MessageComponent />
    </Container>
  );
}
