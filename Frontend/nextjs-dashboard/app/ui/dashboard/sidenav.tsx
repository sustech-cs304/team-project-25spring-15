"use client";

import React from "react";
import {
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  ListSubheader,
  ListItemIcon,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AssignmentIcon from "@mui/icons-material/Assignment";

// 定义类型接口
interface Lecture {
  id: string;
  title: string;
}

interface Course {
  id: string;
  title: string;
  lectures: Lecture[];
}

interface SidebarProps {
  courses: Course[];
}

export default function SideNav({ courses }: SidebarProps) {
  const [open, setOpen] = React.useState<Record<string, boolean>>({});

  const handleCourseClick = (courseId: string) => {
    setOpen((prev) => ({ ...prev, [courseId]: !prev[courseId] }));
  };

  const handleSelectLecture = (lecture: Lecture) => {
    console.log('Selected lecture:', lecture);
  };

  return (
    <List
      sx={{
        width: 250,
        bgcolor: "background.paper",
        height: "100vh",
        position: "fixed",
        overflowY: "auto",
        zIndex: 1,
      }}
      component="nav"
      subheader={<ListSubheader component="div">课程列表</ListSubheader>}
    >
      {courses?.map((course) => (
        <div key={course.id}>
          <ListItemButton onClick={() => handleCourseClick(course.id)}>
            <ListItemIcon>
              <LibraryBooksIcon />
            </ListItemIcon>
            <ListItemText
              primary={course.title}
              slotProps={{
                primary: {
                  sx: { fontSize: "18px" },
                },
              }}
            />
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
                        sx: { fontSize: "16px" },
                      },
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </div>
      ))}
    </List>
  );
}
