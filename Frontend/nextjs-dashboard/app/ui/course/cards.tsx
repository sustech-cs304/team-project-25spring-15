"use client";

import {
  CheckCircleIcon,
  ArrowPathIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { Course, Lecture } from "@/app/lib/definitions";
import { 
  Card, 
  Typography, 
  CardContent, 
  CardActionArea, 
  Box, 
  Chip, 
  Avatar,
  LinearProgress,
  alpha,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { 
  CalendarToday, 
  Person, 
  PlayCircleOutline,
  Book,
  MoreVert,
  Edit,
  Delete,
} from '@mui/icons-material';
import { useState, MouseEvent } from 'react';

interface CardWrapperProps {
  courses: Course[];
}

// 新增的CourseCard接口
interface CourseCardProps {
  course: Course;
  onClick: () => void;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  showActions?: boolean;
}

const iconMap = {
  notStarted: RocketLaunchIcon,
  inProgress: ArrowPathIcon,
  done: CheckCircleIcon,
};

// 课程主题颜色配置
const courseThemes = [
  { primary: '#667eea', secondary: '#764ba2', accent: '#f093fb' },
  { primary: '#f093fb', secondary: '#f5576c', accent: '#4facfe' },
  { primary: '#4facfe', secondary: '#00f2fe', accent: '#43e97b' },
  { primary: '#43e97b', secondary: '#38f9d7', accent: '#667eea' },
  { primary: '#ffecd2', secondary: '#fcb69f', accent: '#ff8a80' },
];

// 新增用于课程列表显示的CourseCard组件
export default function CourseCard({ course, onClick, onEdit, onDelete, showActions = false }: CourseCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (event: MouseEvent) => {
    event.stopPropagation();
    handleMenuClose();
    onEdit?.(course);
  };

  const handleDelete = (event: MouseEvent) => {
    event.stopPropagation();
    handleMenuClose();
    onDelete?.(course);
  };

  // 添加空值检查
  if (!course) {
    return (
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        p: 2,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}>
        <Typography color="text.secondary">课程数据加载中...</Typography>
      </Card>
    );
  }

  // 根据课程ID选择主题颜色
  const themeIndex = course.courseId % courseThemes.length;
  const theme = courseThemes[themeIndex];

  // 计算课程进度
  const totalLectures = course.lectures?.length || 0;
  const completedLectures = course.lectures?.filter(lecture => lecture.status === 'done').length || 0;
  const progress = totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;

  // 获取课程状态
  const getStatusInfo = () => {
    if (totalLectures === 0) {
      return { label: '准备中', color: 'default' as const, icon: <RocketLaunchIcon className="w-4 h-4" /> };
    }
    if (progress === 100) {
      return { label: '已完成', color: 'success' as const, icon: <CheckCircleIcon className="w-4 h-4" /> };
    }
    if (progress > 0) {
      return { label: '进行中', color: 'primary' as const, icon: <ArrowPathIcon className="w-4 h-4" /> };
    }
    return { label: '未开始', color: 'default' as const, icon: <RocketLaunchIcon className="w-4 h-4" /> };
  };

  const statusInfo = getStatusInfo();
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.9)',
          zIndex: 1,
        },
        '&:hover::before': {
          background: 'rgba(255, 255, 255, 0.95)',
        },
      }}
    >
      {/* 装饰性背景图案 */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${alpha(theme.accent, 0.3)}, ${alpha(theme.primary, 0.2)})`,
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${alpha(theme.secondary, 0.2)}, ${alpha(theme.accent, 0.1)})`,
          zIndex: 1,
        }}
      />

      {/* 操作菜单按钮 */}
      {showActions && (onEdit || onDelete) && (
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 3 }}>
          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(4px)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {onEdit && (
              <MenuItem onClick={handleEdit}>
                <Edit fontSize="small" sx={{ mr: 1 }} />
                编辑课程
              </MenuItem>
            )}
            {onDelete && (
              <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                <Delete fontSize="small" sx={{ mr: 1 }} />
                删除课程
              </MenuItem>
            )}
          </Menu>
        </Box>
      )}

      <CardActionArea onClick={onClick} sx={{ flexGrow: 1, position: 'relative', zIndex: 2 }}>
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* 头部区域 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                background: `linear-gradient(45deg, ${theme.primary}, ${theme.secondary})`,
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 'bold',
              }}
            >
              <Book />
            </Avatar>
            <Chip
              label={statusInfo.label}
              color={statusInfo.color}
              size="small"
              variant="outlined"
              sx={{ 
                fontWeight: 600,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(4px)',
              }}
            />
          </Box>

          {/* 课程标题 */}
          <Typography 
            variant="h6" 
            component="div" 
            gutterBottom 
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.6em',
            }}
          >
            {course.courseName || '未命名课程'}
          </Typography>

          {/* 课程描述 */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              flexGrow: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5,
            }}
          >
            {course.description || '暂无描述'}
          </Typography>

          {/* 进度条 */}
          {totalLectures > 0 && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  学习进度
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {completedLectures}/{totalLectures}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: alpha(theme.primary, 0.2),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    background: `linear-gradient(45deg, ${theme.primary}, ${theme.secondary})`,
                  },
                }}
              />
            </Box>
          )}

          {/* 底部信息 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PlayCircleOutline sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {totalLectures} 讲座
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {course.startTime ? new Date(course.startTime).toLocaleDateString('zh-CN', {
                  month: 'short',
                  day: 'numeric'
                }) : '无日期'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

// 旧的卡片组件，重命名为LectureCardWrapper
export function LectureCardWrapper({ courses }: CardWrapperProps) {
  console.log("courses in CardWrapper:", courses);
  const pathname = usePathname();
  let currentCouseTitle = "";
  let currentLectures: Lecture[] = [];

  if (pathname && pathname.startsWith("/dashboard/")) {
    const courseId = pathname.split("/")[2];

    const currentCourse = courses?.find(
      (course) => course.courseId.toString() === courseId
    );
    if (currentCourse) {
      currentLectures = currentCourse.lectures || [];
      currentCouseTitle = currentCourse.courseName || "";
    }
  }

  return (
    <Card
      sx={{
        flexGrow: 1,
        height: "calc(94vh - 64px)",
        overflow: "hidden",
        padding: "24px",
        borderColor: `2px solid #e0e0e0`,
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h4" gutterBottom>
        {currentCouseTitle || "请选择一个课程"}
      </Typography>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentLectures.length > 0 ? (
          currentLectures.map((lecture) => (
            <LectureCard
              key={lecture.lectureId}
              title={lecture.lectureName || "未命名讲座"}
              value={lecture.status || "notStarted"}
              type={lecture.status || "notStarted"}
              courseId={pathname.split("/")[2]}
              lectureId={lecture.lectureId}
            />
          ))
        ) : (
          <Typography variant="body1">暂无讲座</Typography>
        )}
      </div>
    </Card>
  );
}

// 原CourseCard组件重命名为LectureCard
export function LectureCard({
                             title,
                             value,
                             type,
                             lectureId,
                             courseId,
                           }: {
  title: string;
  value: number | string;
  type: "done" | "inProgress" | "notStarted";
  lectureId: string | number;
  courseId: string | number;
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-300 p-3 shadow-sm relative">
      <div className="flex p-4 relative z-0">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`truncate rounded-xl bg-white px-4 py-8 text-center text-2xl relative z-0`}
      >
        {value}
      </p>
    </div>
  );
}
