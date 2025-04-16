import React, { useState } from 'react';
        import {
            List,
            ListItemButton,
            ListItemText,
            Collapse,
            ListSubheader,
            ListItemIcon,
            Typography,
            Button,
            Box,
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

        const Sidebar = ({ courses, onSelectLecture }) => {
            const [open, setOpen] = useState({});
            const [openCourseDialog, setOpenCourseDialog] = useState(false);
            const [openLectureDialog, setOpenLectureDialog] = useState(false);
            const [openEditCourseDialog, setOpenEditCourseDialog] = useState(false);
            const [openEditLectureDialog, setOpenEditLectureDialog] = useState(false);
            const [newCourse, setNewCourse] = useState({ title: '', description: '' });
            const [newLecture, setNewLecture] = useState({ title: '', courseId: '' });
            const [editingCourse, setEditingCourse] = useState(null);
            const [editingLecture, setEditingLecture] = useState(null);
            const [selectedCourseId, setSelectedCourseId] = useState('');
            const [localCourses, setLocalCourses] = useState(courses);

            // 菜单状态
            const [courseMenuAnchor, setCourseMenuAnchor] = useState(null);
            const [lectureMenuAnchor, setLectureMenuAnchor] = useState(null);
            const [activeCourseId, setActiveCourseId] = useState(null);
            const [activeLectureId, setActiveLectureId] = useState(null);

            const handleCourseClick = (courseId) => {
                setOpen((prev) => ({ ...prev, [courseId]: !prev[courseId] }));
                setSelectedCourseId(courseId);
            };

            // 课程菜单操作
            const handleCourseMenuOpen = (event, courseId) => {
                event.stopPropagation();
                setCourseMenuAnchor(event.currentTarget);
                setActiveCourseId(courseId);
            };

            const handleCourseMenuClose = () => {
                setCourseMenuAnchor(null);
                setActiveCourseId(null);
            };

            // 讲座菜单操作
            const handleLectureMenuOpen = (event, lectureId, courseId) => {
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
            const handleOpenEditCourseDialog = (course) => {
                setEditingCourse({...course});
                setOpenEditCourseDialog(true);
                handleCourseMenuClose();
            };

            const handleCloseEditCourseDialog = () => {
                setOpenEditCourseDialog(false);
                setEditingCourse(null);
            };

            // 编辑讲座对话框
            const handleOpenEditLectureDialog = (lecture) => {
                setEditingLecture({...lecture});
                setOpenEditLectureDialog(true);
                handleLectureMenuClose();
            };

            const handleCloseEditLectureDialog = () => {
                setOpenEditLectureDialog(false);
                setEditingLecture(null);
            };

            // 添加课程
            const handleAddCourse = () => {
                if (!newCourse.title) {
                    alert('请输入课程名称');
                    return;
                }

                const newId = `course-${Date.now()}`;
                const newCourseData = {
                    id: newId,
                    title: newCourse.title,
                    description: newCourse.description,
                    lectures: []
                };

                setLocalCourses([...localCourses, newCourseData]);
                handleCloseCourseDialog();
                setOpen((prev) => ({ ...prev, [newId]: true }));
            };

            // 添加讲座
            const handleAddLecture = () => {
                if (!newLecture.title) {
                    alert('请输入讲座名称');
                    return;
                }

                const courseId = newLecture.courseId || selectedCourseId;
                if (!courseId) {
                    alert('请选择课程');
                    return;
                }

                const newId = `lecture-${Date.now()}`;
                setLocalCourses(prevCourses =>
                    prevCourses.map(course =>
                        course.id === courseId
                        ? {
                            ...course,
                            lectures: [
                                ...course.lectures,
                                { id: newId, title: newLecture.title, courseId }
                            ]
                        }
                        : course
                    )
                );

                handleCloseLectureDialog();
            };

            // 编辑课程
            const handleEditCourse = () => {
                if (!editingCourse || !editingCourse.title) {
                    alert('请输入课程名称');
                    return;
                }

                setLocalCourses(prevCourses =>
                    prevCourses.map(course =>
                        course.id === editingCourse.id
                        ? { ...course, title: editingCourse.title, description: editingCourse.description }
                        : course
                    )
                );

                handleCloseEditCourseDialog();
            };

            // 编辑讲座
            const handleEditLecture = () => {
                if (!editingLecture || !editingLecture.title) {
                    alert('请输入讲座名称');
                    return;
                }

                setLocalCourses(prevCourses =>
                    prevCourses.map(course =>
                        course.id === editingLecture.courseId
                        ? {
                            ...course,
                            lectures: course.lectures.map(lecture =>
                                lecture.id === editingLecture.id
                                ? { ...lecture, title: editingLecture.title }
                                : lecture
                            )
                        }
                        : course
                    )
                );

                handleCloseEditLectureDialog();
            };

            // 删除课程
            const handleDeleteCourse = (courseId) => {
                if (window.confirm('确定要删除该课程吗？所有该课程下的讲座也会被删除。')) {
                    setLocalCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
                    handleCourseMenuClose();
                }
            };

            // 删除讲座
            const handleDeleteLecture = (lectureId, courseId) => {
                if (window.confirm('确定要删除该讲座吗？')) {
                    setLocalCourses(prevCourses =>
                        prevCourses.map(course =>
                            course.id === courseId
                            ? {
                                ...course,
                                lectures: course.lectures.filter(lecture => lecture.id !== lectureId)
                            }
                            : course
                        )
                    );
                    handleLectureMenuClose();
                }
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
                        {localCourses.map((course) => (
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
                                        {course.lectures.map((lecture) => (
                                            <ListItemButton
                                                key={lecture.id}
                                                sx={{ pl: 4 }}
                                                onClick={() => onSelectLecture(lecture)}
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
                            onClick={() => handleOpenEditCourseDialog(
                                localCourses.find(course => course.id === activeCourseId)
                            )}
                        >
                            <EditIcon fontSize="small" sx={{ mr: 1 }} />
                            编辑课程
                        </MenuItem>
                        <MenuItem onClick={() => handleDeleteCourse(activeCourseId)}>
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
                        <MenuItem onClick={() => handleDeleteLecture(activeLectureId, selectedCourseId)}>
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
                                onChange={(e) => setEditingCourse({...editingCourse, title: e.target.value})}
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
                                onChange={(e) => setEditingCourse({...editingCourse, description: e.target.value})}
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
                                onChange={(e) => setEditingLecture({...editingLecture, title: e.target.value})}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseEditLectureDialog}>取消</Button>
                            <Button onClick={handleEditLecture} variant="contained">保存</Button>
                        </DialogActions>
                    </Dialog>
                </>
            );
        };

        export default Sidebar;