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

  const [open, setOpen] = useState<Record<string, boolean>>({});
  const handleCourseClick = (courseId: string) => {
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
              <ListItemButton onClick={() => handleCourseClick(course.id ?? "")}>
                <ListItemText primary={course.title} />
                {open[course.id ?? ""] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={open[course.id ?? ""]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {course.lectures?.map((lecture) => (
                    <ListItemButton
                      key={lecture.id}
                      component={NavLink}
                      to={`courses/${course.id}/${lecture.id}`}
                      // 这里的路由匹配到 routes.ts 文件，给lectureId courseId 赋值，在loader中可以得到
                      // 设置component以后，格式都变为NavLink的了，这里无法设置
                    >
                      <ListItemText primary={lecture.title} sx={{ pl: 3 }}/>
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
