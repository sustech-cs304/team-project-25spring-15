import {
  Form,
  Link,
  Outlet,
  NavLink,
  useNavigation,
  useSubmit,
} from "react-router";
import { useEffect, useState } from "react";
import type { Route } from "./+types/sidebar";
import { fetchCourses } from "../data";
import type { Lecture, Course } from "../data";

import {
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  ListSubheader
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// loader表示从server端获取数据
export async function loader() {
  const courses: Course[] = await fetchCourses();
  return { courses };
}

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  const { courses } = loaderData;

  const [open, setOpen] = useState<Record<number, boolean>>({});
  const handleCourseClick = (courseId: number) => {
    setOpen((prev) => ({ ...prev, [courseId]: !prev[courseId]}));
  };

  return (
    <>
      <div id="sidebar">
        <h1>
          <Link to="about">React Router Contacts</Link>
        </h1>
        <List
          sx={{ width: '100%', bgcolor: 'background.paper' }}
          component="nav"
          subheader={
              <ListSubheader component="div">
                  课程列表
              </ListSubheader>
          }
        >
          {courses.map((course: Course) => (
            <div key={course.id}>
              <ListItemButton onClick={() => handleCourseClick(course.id ?? -1)}>
                <ListItemText primary={course.title} />
                {open[course.id ?? -1] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={open[course.id ?? -1]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {course.lectures?.map((lecture) => (
                    <ListItemButton
                      key={lecture.id}
                      sx={{ pl: 4 }}
                      onClick={() => {}}
                    >
                      <ListItemText primary={lecture.title} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </div>
          ))}
      </List>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
