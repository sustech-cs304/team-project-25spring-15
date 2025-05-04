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
import { usePathname, useRouter } from 'next/navigation';
import { Course, Lecture } from '@/app/lib/definitions';

interface SidebarProps {
  courses: Course[];
}

export default function SideNav({ courses }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname(); // 获取当前路径
  const [open, setOpen] = React.useState<Record<string, boolean>>({});

  const handleCourseClick = (courseId: string) => {
    setOpen((prev) => {
      const newState: Record<string, boolean> = {};

      courses?.forEach(course => {
        newState[course.id] = false;
      });
      newState[courseId] = !prev[courseId];
      return newState;
    });

    const currentCourseUrl = `/dashboard/${courseId}`;
    if (pathname === currentCourseUrl) {
      router.push('/dashboard');
    } else {
      router.push(currentCourseUrl);
    }
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
