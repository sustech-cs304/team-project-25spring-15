import React from 'react';
import {
    List,
    ListItemButton,
    ListItemText,
    Collapse,
    ListSubheader
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const Sidebar = ({ courses, onSelectLecture }) => {
    const [open, setOpen] = React.useState({});

    const handleCourseClick = (courseId) => {
        setOpen((prev) => ({ ...prev, [courseId]: !prev[courseId] }));
    };

    return (
        <List
            sx={{
                width: 300,
                bgcolor: 'background.paper',
                height: '100vh',
                position: 'fixed',
                overflowY: 'auto',
                zIndex: 1,
            }}
            component="nav"
            subheader={
                <ListSubheader component="div">
                    课程列表
                </ListSubheader>
            }
        >
            {courses.map((course) => (
                <div key={course.id}>
                    <ListItemButton onClick={() => handleCourseClick(course.id)}>
                        <ListItemText primary={course.title} />
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
                                    <ListItemText primary={lecture.title} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>
                </div>
            ))}
        </List>
    );
};

export default Sidebar;
