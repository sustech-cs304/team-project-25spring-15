"use client";

import { CourseAPI, LectureAPI } from "@/app/lib/api";
import React, { useState } from 'react';
import {
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  ListSubheader,
  ListItemIcon,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  Menu,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { usePathname, useRouter } from 'next/navigation';
import { Course, Lecture } from '@/app/lib/definitions';

interface SidebarProps {
  courses: Course[];
}

export default function SideNav({ courses }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [openLectureDialog, setOpenLectureDialog] = useState(false);
  const [openEditCourseDialog, setOpenEditCourseDialog] = useState(false);
  const [openEditLectureDialog, setOpenEditLectureDialog] = useState(false);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({ title: '', description: '' });
  const [newLecture, setNewLecture] = useState<Partial<Lecture>>({ title: '', courseId: '' });
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [localCourses, setLocalCourses] = useState<Course[]>(courses);

  // 菜单状态
  const [courseMenuAnchor, setCourseMenuAnchor] = useState<null | HTMLElement>(null);
  const [lectureMenuAnchor, setLectureMenuAnchor] = useState<null | HTMLElement>(null);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLectureId, setActiveLectureId] = useState<string | null>(null);

  const handleCourseClick = (courseId: string) => {
    setOpen((prev) => {
      const newState: Record<string, boolean> = {};

      localCourses?.forEach(course => {
        newState[course.id] = false;
      });
      newState[courseId] = !prev[courseId];
      return newState;
    });

    setSelectedCourseId(courseId);
    const currentCourseUrl = `/dashboard/${courseId}`;
    if (pathname === currentCourseUrl) {
      router.push('/dashboard');
    } else {
      router.push(currentCourseUrl);
    }
  };

  // 课程菜单操作
  const handleCourseMenuOpen = (event: React.MouseEvent<HTMLElement>, courseId: string) => {
    event.stopPropagation();
    setCourseMenuAnchor(event.currentTarget);
    setActiveCourseId(courseId);
  };

  const handleCourseMenuClose = () => {
    setCourseMenuAnchor(null);
    setActiveCourseId(null);
  };

  // 讲座菜单操作
  const handleLectureMenuOpen = (event: React.MouseEvent<HTMLElement>, lectureId: string, courseId: string) => {
    event.stopPropagation();
    setLectureMenuAnchor(event.currentTarget);
    setActiveLectureId(lectureId);
    setSelectedCourseId(courseId);
  };

  const handleLectureMenuClose = () => {
    setLectureMenuAnchor(null);
    setActiveLectureId(null);
  };

  // 添加课程对话框
  const handleOpenCourseDialog = () => {
    setOpenCourseDialog(true);
  };

  const handleCloseCourseDialog = () => {
    setOpenCourseDialog(false);
    setNewCourse({ title: '', description: '' });
  };

  // 添加讲座对话框
  const handleOpenLectureDialog = () => {
    setOpenLectureDialog(true);
  };

  const handleCloseLectureDialog = () => {
    setOpenLectureDialog(false);
    setNewLecture({ title: '', courseId: selectedCourseId });
  };

  // 编辑课程对话框
  const handleOpenEditCourseDialog = (course: Course) => {
    setEditingCourse({...course});
    setOpenEditCourseDialog(true);
    handleCourseMenuClose();
  };

  const handleCloseEditCourseDialog = () => {
    setOpenEditCourseDialog(false);
    setEditingCourse(null);
  };

  // 编辑讲座对话框
  const handleOpenEditLectureDialog = (lecture: Lecture) => {
    setEditingLecture({...lecture});
    setOpenEditLectureDialog(true);
    handleLectureMenuClose();
  };

  const handleCloseEditLectureDialog = () => {
    setOpenEditLectureDialog(false);
    setEditingLecture(null);
  };

  // 添加课程
  const handleAddCourse = async () => {
    if (!newCourse.title) {
      alert('请输入课程名称');
      return;
    }

    try {
      const addedCourse = await CourseAPI.addCourse({
        title: newCourse.title,
        description: newCourse.description || '',
      });

      setLocalCourses([...localCourses, {...addedCourse, lectures: []}]);
      handleCloseCourseDialog();
      setOpen((prev) => ({...prev, [addedCourse.id]: true}));
    } catch (error) {
      console.error('添加课程失败:', error);
      alert('添加课程失败，请稍后重试');
    }
  };

  // 添加讲座
  const handleAddLecture = async () => {
    if (!newLecture.title) {
      alert('请输入讲座名称');
      return;
    }

    const courseId = newLecture.courseId || selectedCourseId;
    if (!courseId) {
      alert('请选择课程');
      return;
    }

    try {
      const addedLecture = await LectureAPI.addLecture({
        title: newLecture.title,
        courseId,
      });

      setLocalCourses(prevCourses =>
        prevCourses.map(course =>
          course.id === courseId
            ? {...course, lectures: [...course.lectures, addedLecture]}
            : course
        )
      );
      handleCloseLectureDialog();
    } catch (error) {
      console.error('添加讲座失败:', error);
      alert('添加讲座失败，请稍后重试');
    }
  };

  // 编辑课程
  const handleEditCourse = async () => {
    if (!editingCourse || !editingCourse.title) {
      alert('请输入课程名称');
      return;
    }

    try {
      const updatedCourse = await CourseAPI.updateCourse(editingCourse.id, {
        title: editingCourse.title,
        description: editingCourse.description || '',
      });

      setLocalCourses(prevCourses =>
        prevCourses.map(course =>
          course.id === updatedCourse.id ? {...updatedCourse, lectures: course.lectures} : course
        )
      );
      handleCloseEditCourseDialog();
    } catch (error) {
      console.error('编辑课程失败:', error);
      alert('编辑课程失败，请稍后重试');
    }
  };

  // 编辑讲座
  const handleEditLecture = async () => {
    if (!editingLecture || !editingLecture.title) {
      alert('请输入讲座名称');
      return;
    }

    try {
      const updatedLecture = await LectureAPI.updateLecture(editingLecture.id, {
        title: editingLecture.title,
      });

      setLocalCourses(prevCourses =>
        prevCourses.map(course =>
          course.id === editingLecture.courseId
            ? {
              ...course,
              lectures: course.lectures.map(lecture =>
                lecture.id === updatedLecture.id ? updatedLecture : lecture
              ),
            }
            : course
        )
      );
      handleCloseEditLectureDialog();
    } catch (error) {
      console.error('编辑讲座失败:', error);
      alert('编辑讲座失败，请稍后重试');
    }
  };

  // 删除课程
  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('确定要删除该课程吗？所有该课程下的讲座也会被删除。')) {
      try {
        await CourseAPI.deleteCourse(courseId);
        setLocalCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
        handleCourseMenuClose();
      } catch (error) {
        console.error('删除课程失败:', error);
        alert('删除课程失败，请稍后重试');
      }
    }
  };

  // 删除讲座
  const handleDeleteLecture = async (lectureId: string, courseId: string) => {
    if (window.confirm('确定要删除该讲座吗？')) {
      try {
        await LectureAPI.deleteLecture(lectureId);
        setLocalCourses(prevCourses =>
          prevCourses.map(course =>
            course.id === courseId
              ? {...course, lectures: course.lectures.filter(lecture => lecture.id !== lectureId)}
              : course
          )
        );
        handleLectureMenuClose();
      } catch (error) {
        console.error('删除讲座失败:', error);
        alert('删除讲座失败，请稍后重试');
      }
    }
  };

  const handleSelectLecture = (lecture: Lecture) => {
    console.log('Selected lecture:', lecture);
  };

  return (
    <>
      <List
        sx={{
          width: 250,
          bgcolor: 'background.paper',
          height: '100vh',
          position: 'fixed',
          overflowY: 'auto',
          zIndex: 1,
        }}
        component="nav"
        subheader={
          <Box sx={{ display: 'flex', flexDirection: 'column', p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <ListSubheader component="div" sx={{ position: 'static' }}>
                课程列表
              </ListSubheader>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleOpenCourseDialog}
                fullWidth
              >
                添加课程
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleOpenLectureDialog}
                disabled={!selectedCourseId}
                fullWidth
              >
                添加讲座
              </Button>
            </Box>
          </Box>
        }
      >
        {localCourses?.map((course) => (
          <div key={course.id}>
            <ListItemButton onClick={() => handleCourseClick(course.id)}>
              <ListItemIcon>
                <LibraryBooksIcon />
              </ListItemIcon>
              <ListItemText
                primary={course.title}
                slotProps={{
                  primary: {
                    sx: { fontSize: '18px' },
                  },
                }}
              />
              <IconButton
                size="small"
                onClick={(e) => handleCourseMenuOpen(e, course.id)}
                sx={{ mr: 1 }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              {open[course.id] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open[course.id]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {course.lectures?.map((lecture) => (
                  <ListItemButton
                    key={lecture.id}
                    sx={{ pl: 4 }}
                    onClick={() => handleSelectLecture(lecture)}
                  >
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={lecture.title}
                      slotProps={{
                        primary: {
                          sx: { fontSize: '16px' },
                        },
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => handleLectureMenuOpen(e, lecture.id, course.id)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </div>
        ))}
      </List>

      {/* 课程操作菜单 */}
      <Menu
        anchorEl={courseMenuAnchor}
        open={Boolean(courseMenuAnchor)}
        onClose={handleCourseMenuClose}
      >
        <MenuItem
          onClick={() => {
            const course = localCourses.find(course => course.id === activeCourseId);
            if (course) handleOpenEditCourseDialog(course);
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          编辑课程
        </MenuItem>
        <MenuItem onClick={() => activeCourseId && handleDeleteCourse(activeCourseId)}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          删除课程
        </MenuItem>
      </Menu>

      {/* 讲座操作菜单 */}
      <Menu
        anchorEl={lectureMenuAnchor}
        open={Boolean(lectureMenuAnchor)}
        onClose={handleLectureMenuClose}
      >
        <MenuItem
          onClick={() => {
            const course = localCourses.find(c => c.id === selectedCourseId);
            const lecture = course?.lectures.find(l => l.id === activeLectureId);
            if (lecture) handleOpenEditLectureDialog(lecture);
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          编辑讲座
        </MenuItem>
        <MenuItem onClick={() => activeLectureId && selectedCourseId && handleDeleteLecture(activeLectureId, selectedCourseId)}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          删除讲座
        </MenuItem>
      </Menu>

      {/* 添加课程对话框 */}
      <Dialog open={openCourseDialog} onClose={handleCloseCourseDialog}>
        <DialogTitle>添加新课程</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="课程名称"
            type="text"
            fullWidth
            variant="outlined"
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="课程描述"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCourseDialog}>取消</Button>
          <Button onClick={handleAddCourse} variant="contained">添加</Button>
        </DialogActions>
      </Dialog>

      {/* 添加讲座对话框 */}
      <Dialog open={openLectureDialog} onClose={handleCloseLectureDialog}>
        <DialogTitle>添加新讲座</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>选择课程</InputLabel>
            <Select
              value={newLecture.courseId || selectedCourseId}
              label="选择课程"
              onChange={(e) => setNewLecture({ ...newLecture, courseId: e.target.value })}
            >
              {localCourses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="讲座名称"
            type="text"
            fullWidth
            variant="outlined"
            value={newLecture.title}
            onChange={(e) => setNewLecture({ ...newLecture, title: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLectureDialog}>取消</Button>
          <Button onClick={handleAddLecture} variant="contained">添加</Button>
        </DialogActions>
      </Dialog>

      {/* 编辑课程对话框 */}
      <Dialog open={openEditCourseDialog} onClose={handleCloseEditCourseDialog}>
        <DialogTitle>编辑课程</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="课程名称"
            type="text"
            fullWidth
            variant="outlined"
            value={editingCourse?.title || ''}
            onChange={(e) => setEditingCourse(editingCourse ? {...editingCourse, title: e.target.value} : null)}
          />
          <TextField
            margin="dense"
            label="课程描述"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={editingCourse?.description || ''}
            onChange={(e) => setEditingCourse(editingCourse ? {...editingCourse, description: e.target.value} : null)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditCourseDialog}>取消</Button>
          <Button onClick={handleEditCourse} variant="contained">保存</Button>
        </DialogActions>
      </Dialog>

      {/* 编辑讲座对话框 */}
      <Dialog open={openEditLectureDialog} onClose={handleCloseEditLectureDialog}>
        <DialogTitle>编辑讲座</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="讲座名称"
            type="text"
            fullWidth
            variant="outlined"
            value={editingLecture?.title || ''}
            onChange={(e) => setEditingLecture(editingLecture ? {...editingLecture, title: e.target.value} : null)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditLectureDialog}>取消</Button>
          <Button onClick={handleEditLecture} variant="contained">保存</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
