'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Button
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChatIcon from '@mui/icons-material/Chat';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PeopleIcon from '@mui/icons-material/People';
import { useStore } from '@/store/useStore';

interface LectureSidebarProps {
  courseId: number;
  lectureId: number;
}

export default function LectureSidebar({ courseId, lectureId }: LectureSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const userInfo = useStore(state => state.userInfo);
  const courses = useStore(state => state.courses);
  
  // 获取当前课程信息
  const currentCourse = courses.find(course => course.courseId === courseId);
  const isTeacher = userInfo?.identity === 'teacher' && currentCourse?.teacherId === userInfo.userId;

  // 确定当前激活的菜单项
  const getActiveItem = () => {
    if (pathname.includes('/courseware')) return 0;
    if (pathname.includes('/exercises')) return 1;
    if (pathname.includes('/comments')) return 2;
    if (pathname.includes('/ai')) return 3;
    if (pathname.includes('/collab')) return 4;
    return 0; // 默认激活课件
  };

  const [activeItem, setActiveItem] = useState(getActiveItem());

  const handleNavigate = (index: number) => {
    setActiveItem(index);
    
    // 导航到对应的页面
    let path = '';
    switch (index) {
      case 0:
        path = `/dashboard/${courseId}/${lectureId}/courseware`;
        break;
      case 1:
        path = `/dashboard/${courseId}/${lectureId}/exercises`;
        break;
      case 2:
        path = `/dashboard/${courseId}/${lectureId}/comments`;
        break;
      case 3:
        path = `/dashboard/${courseId}/${lectureId}/ai`;
        break;
      case 4:
        path = `/dashboard/${courseId}/${lectureId}/collab`;
        break;
    }
    
    router.push(path);
  };

  return (
    <Box sx={{ 
      width: 240, 
      bgcolor: 'background.paper',
      borderRight: '1px solid #e0e0e0',
      height: 'calc(100vh - 64px)',
      position: 'sticky',
      top: 64,
      overflowY: 'auto'
    }}>
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push(`/dashboard/course/${courseId}`)}
        sx={{ m: 2 }}
      >
        返回课程
      </Button>
      
      <Divider />
      
      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={activeItem === 0}
            onClick={() => handleNavigate(0)}
          >
            <ListItemIcon>
              <PictureAsPdfIcon />
            </ListItemIcon>
            <ListItemText primary="课件" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton
            selected={activeItem === 1}
            onClick={() => handleNavigate(1)}
          >
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="练习" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton
            selected={activeItem === 2}
            onClick={() => handleNavigate(2)}
          >
            <ListItemIcon>
              <ChatIcon />
            </ListItemIcon>
            <ListItemText primary="评论" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton
            selected={activeItem === 3}
            onClick={() => handleNavigate(3)}
          >
            <ListItemIcon>
              <SmartToyIcon />
            </ListItemIcon>
            <ListItemText primary="AI" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton
            selected={activeItem === 4}
            onClick={() => handleNavigate(4)}
          >
            <ListItemIcon>
              <PsychologyIcon />
            </ListItemIcon>
            <ListItemText primary="头脑风暴" />
          </ListItemButton>
        </ListItem>
      </List>
      
      {isTeacher && (
        <>
          <Divider sx={{ mt: 2 }} />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => router.push(`/dashboard/course/${courseId}/students`)}
              >
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="所有学生" />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}
    </Box>
  );
} 