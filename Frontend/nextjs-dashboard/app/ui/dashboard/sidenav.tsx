"use client";

import { CourseAPI, LectureAPI } from "@/app/lib/api";
import React, { useEffect, useState } from 'react';
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
import { fetchCourses } from "@/app/lib/data";
import { useStore } from '@/store/useStore';

export default function SideNav() {
  const router = useRouter();
  const pathname = usePathname();

  // —— 全局状态 ——
  const { courses, setCourses } = useStore(state => ({
    courses: state.courses,
    setCourses: state.setCourses,
  }));

  // 本地 UI 状态
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [newCourse, setNewCourse] = useState<Partial<Course>>({ courseName: '', description: '' });
  const [newLecture, setNewLecture] = useState<Partial<Lecture>>({ lectureName: '', description: '', courseId: undefined });
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>(undefined);

  // 对话框状态
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [openLectureDialog, setOpenLectureDialog] = useState(false);
  const [openEditCourseDialog, setOpenEditCourseDialog] = useState(false);
  const [openEditLectureDialog, setOpenEditLectureDialog] = useState(false);

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);

  // 菜单状态
  const [courseMenuAnchor, setCourseMenuAnchor] = useState<null | HTMLElement>(null);
  const [lectureMenuAnchor, setLectureMenuAnchor] = useState<null | HTMLElement>(null);
  const [activeCourseId, setActiveCourseId] = useState<number | null>(null);
  const [activeLectureId, setActiveLectureId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const list = await fetchCourses();
        setCourses(list);
      } catch (err) {
        console.error('拉取课程失败', err);
      }
    }
    load();
  }, [setCourses]);

  const handleCourseClick = (courseId: number) => {
    setOpen((prev) => {
      const newState = { ...prev };
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
  const handleCourseMenuOpen = (event: React.MouseEvent<HTMLElement>, courseId: number) => {
    event.stopPropagation();
    setCourseMenuAnchor(event.currentTarget);
    setActiveCourseId(courseId);
  };

  const handleCourseMenuClose = () => {
    setCourseMenuAnchor(null);
    setActiveCourseId(null);
  };

  // 讲座菜单操作
  const handleLectureMenuOpen = (event: React.MouseEvent<HTMLElement>, lectureId: number, courseId: number) => {
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
    setNewCourse({ courseName: '', description: '' });
  };

  // 添加讲座对话框
  const handleOpenLectureDialog = () => {
    setOpenLectureDialog(true);
    setNewLecture({ lectureName: '', description: '', courseId: selectedCourseId });
  };

  const handleCloseLectureDialog = () => {
    setOpenLectureDialog(false);
    setNewLecture({ lectureName: '', description: '', courseId: undefined });
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

  const reloadCourses = async () => {
    try {
      const list = await fetchCourses();
      setCourses(list);
    } catch (e) {
      console.error('刷新课程列表失败', e);
      alert('刷新课程列表失败');
    }
  };

  // 添加课程
  const handleAddCourse = async () => {
    if (!newCourse.courseName) return alert('请输入课程名');
    try {
      await CourseAPI.addCourse({
        courseName: newCourse.courseName,
        description: newCourse.description || ''
      });
      await reloadCourses();
      handleCloseCourseDialog();
    } catch (error) {
      console.error('添加课程失败', error);
      alert('添加课程失败');
    }
  };

  // 添加讲座
  const handleAddLecture = async () => {
    if (!newLecture.lectureName) return alert('请输入讲座名称');
    if (!newLecture.courseId && !selectedCourseId) return alert('请选择课程');

    const courseId = newLecture.courseId || selectedCourseId;
    try {
      await LectureAPI.addLecture(courseId!, {
        lectureName: newLecture.lectureName,
        description: newLecture.description || ''
      });
      await reloadCourses();
      handleCloseLectureDialog();
    } catch (error) {
      console.error('添加讲座失败', error);
      alert('添加讲座失败');
    }
  };

  // 编辑课程
  const handleEditCourse = async () => {
    if (!editingCourse) return;
    try {
      await CourseAPI.updateCourse(editingCourse.courseId, {
        courseName: editingCourse.courseName,
        description: editingCourse.description || ''
      });
      await reloadCourses();
      handleCloseEditCourseDialog();
    } catch (error) {
      console.error('编辑课程失败', error);
      alert('编辑课程失败');
    }
  };

  // 编辑讲座
  const handleEditLecture = async () => {
    if (!editingLecture) return;
    try {
      await LectureAPI.updateLecture(editingLecture.lectureId, {
        lectureName: editingLecture.lectureName,
        description: editingLecture.description || ''
      });
      await reloadCourses();
      handleCloseEditLectureDialog();
    } catch (error) {
      console.error('编辑讲座失败', error);
      alert('编辑讲座失败');
    }
  };

  // 删除课程
  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm('确认删除此课程？')) return;
    try {
      await CourseAPI.deleteCourse(courseId);
      await reloadCourses();
      handleCourseMenuClose();
    } catch (error) {
      console.error('删除课程失败', error);
      alert('删除课程失败');
    }
  };

  // 删除讲座
  const handleDeleteLecture = async (lectureId: number) => {
    if (!confirm('确认删除此讲座？')) return;
    try {
      await LectureAPI.deleteLecture(lectureId);
      await reloadCourses();
      handleLectureMenuClose();
    } catch (error) {
      console.error('删除讲座失败', error);
      alert('删除讲座失败');
    }
  };

  const handleSelectLecture = (courseId: number, lecture: Lecture) => {
    router.push(`/dashboard/${courseId}/${lecture.lectureId}`);
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
          <Box key="courses-subheader" sx={{ display: 'flex', flexDirection: 'column', p: 1 }}>
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
        {courses?.map((course) => (
          <div key={course.courseId}>
            <ListItemButton onClick={() => handleCourseClick(course.courseId)}>
              <ListItemIcon>
                <LibraryBooksIcon />
              </ListItemIcon>
              <ListItemText
                primary={course.courseName}
                slotProps={{
                  primary: {
                    sx: { fontSize: '18px' },
                  },
                }}
              />
              <IconButton
                size="small"
                onClick={(e) => handleCourseMenuOpen(e, course.courseId)}
                sx={{ mr: 1 }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              {open[course.courseId] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open[course.courseId]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {course.lectures?.map((lecture) => (
                  <ListItemButton
                    key={lecture.lectureId}
                    sx={{ pl: 4 }}
                    onClick={() => handleSelectLecture(course.courseId, lecture)}
                  >
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={lecture.lectureName}
                      slotProps={{
                        primary: {
                          sx: { fontSize: '16px' },
                        },
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => handleLectureMenuOpen(e, lecture.lectureId, course.courseId)}
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
            const course = courses.find(course => course.courseId === activeCourseId);
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
            const course = courses.find(c => c.courseId === selectedCourseId);
            const lecture = course?.lectures?.find(l => l.lectureId === activeLectureId);
            if (lecture) handleOpenEditLectureDialog(lecture);
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          编辑讲座
        </MenuItem>
        <MenuItem onClick={() => activeLectureId && handleDeleteLecture(activeLectureId)}>
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
            value={newCourse.courseName}
            onChange={(e) => setNewCourse({ ...newCourse, courseName: e.target.value })}
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
              value={newLecture.courseId || selectedCourseId || ''}
              label="选择课程"
              onChange={(e) => setNewLecture({ ...newLecture, courseId: Number(e.target.value) })}
            >
              {courses.map((course) => (
                <MenuItem key={course.courseId} value={course.courseId}>
                  {course.courseName}
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
            value={editingCourse?.courseName || ''}
            onChange={(e) => setEditingCourse(editingCourse ? {...editingCourse, courseName: e.target.value} : null)}
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
            value={editingLecture?.lectureName || ''}
            onChange={(e) => setEditingLecture(editingLecture ? {...editingLecture, lectureName: e.target.value} : null)}
          />
          <TextField
            margin="dense"
            label="讲座描述"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={editingLecture?.description || ''}
            onChange={(e) => setEditingLecture(editingLecture ? {...editingLecture, description: e.target.value} : null)}
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
