'use client';

import React, { useState } from "react";
import {
  Box,
  Card,
  Tabs,
  Tab,
  Typography,
  IconButton,
  InputBase,
  Paper,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { initialTasks, exerciseContents } from "@/app/mock/mocked-data";
import ExercisesRenderer from "./exercise-renderer";

interface ExercisesListProps {
  onExerciseClick: (taskId: number) => void;
}

interface Exercise {
  id: number;
  content: string;
}

// 顶部过滤Tab的四种类型
const filterOptions = ["全部", "待完成", "紧急", "已完成"];

const TaskListContainer = styled(Card)(({ theme }) => ({
  width: "90%",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const FilterTabsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

const SearchContainer = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "2px 8px",
  marginLeft: "auto", // 使搜索框靠右对齐
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#f0f0f0",
}));

const TaskRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1, 0),
  borderBottom: "1px solid #f0f0f0",
  ":last-child": {
    borderBottom: "none",
  },
  cursor: "pointer", // 添加指针样式
  "&:hover": {
    backgroundColor: theme.palette.action.hover, // 添加悬停效果
  },
}));

const StatusLabel = styled(Typography)(({ theme, color }) => ({
  color: color || theme.palette.text.primary,
  fontSize: "0.875rem",
}));

export function ExercisesList({ onExerciseClick }: ExercisesListProps) {
  const [tabValue, setTabValue] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [tasks] = useState(initialTasks);

  // Tab切换
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 处理练习点击
  const handleTaskClick = (taskId: number) => {
    if (onExerciseClick) {
      onExerciseClick(taskId);
    }
  };

  // 根据当前过滤Tab和搜索文本对任务进行筛选
  const filteredTasks = tasks.filter((task) => {
    // 根据Tab过滤
    switch (tabValue) {
      case 1: // 待完成：不显示已完成的任务
        if (task.isDone) return false;
        break;
      case 2: // 紧急：仅保留紧急的（且未完成）
        if (!task.isUrgent || task.isDone) return false;
        break;
      case 3: // 已完成
        if (!task.isDone) return false;
        break;
      default:
        break;
    }
    // 搜索关键字过滤
    if (searchText && !task.title.includes(searchText)) {
      return false;
    }
    return true;
  });

  // 统计信息
  const total = tasks.length;
  const undoneCount = tasks.filter((t) => !t.isDone).length;
  const urgentCount = tasks.filter((t) => t.isUrgent && !t.isDone).length;

  return (
    <TaskListContainer>
      <FilterTabsContainer>
        <Tabs value={tabValue} onChange={handleTabChange}>
          {filterOptions.map((label) => (
            <Tab key={label} label={label} />
          ))}
        </Tabs>
        {/* 搜索框 */}
        <SearchContainer>
          <IconButton sx={{ p: "4px" }} disabled>
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="搜索任务..."
            inputProps={{ "aria-label": "搜索任务" }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </SearchContainer>
      </FilterTabsContainer>

      {/* 任务列表 */}
      <Box>
        {filteredTasks.map((task) => {
          // 根据任务状态设置显示颜色
          let statusColor = "#555";
          if (task.status === "已逾期") {
            statusColor = "red";
          } else if (task.status === "今日截止") {
            statusColor = "orange";
          } else if (task.isDone) {
            statusColor = "green";
          }

          return (
            <TaskRow key={task.id} onClick={() => handleTaskClick(task.id)}>
              {/* 在任务前显示状态图标 */}
              <Box sx={{ mr: 1 }}>
                {task.isDone ? (
                  <CheckCircleIcon sx={{ color: "green" }} />
                ) : (
                  <RadioButtonUncheckedIcon sx={{ color: "gray" }} />
                )}
              </Box>
              <Typography variant="body1" sx={{ flexGrow: 1 }}>
                {task.title}
              </Typography>
              <StatusLabel color={statusColor}>{task.status}</StatusLabel>
            </TaskRow>
          );
        })}
      </Box>

      {/* 底部统计与新建任务按钮 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {`总计 ${total} 个任务，${undoneCount} 个待完成，${urgentCount} 个紧急`}
        </Typography>
        <Button variant="contained" color="primary">
          新建任务
        </Button>
      </Box>
    </TaskListContainer>
  );
}

export default function ExercisesContainer() {
    const [showExerciseDetail, setShowExerciseDetail] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

    // 处理练习项点击
    const handleExerciseClick = (exerciseId: number) => {
        const content = exerciseContents[exerciseId];
        setSelectedExercise({ id: exerciseId, content });
        setShowExerciseDetail(true);
    };

    // 返回列表
    const handleBackToList = () => {
        setShowExerciseDetail(false);
    };

    return (
        <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
            {showExerciseDetail ? (
                <ExercisesRenderer
                    exerciseContent={selectedExercise?.content}
                    exerciseId={selectedExercise?.id}
                    onBack={handleBackToList}
                />
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <ExercisesList onExerciseClick={handleExerciseClick} />
                </Box>
            )}
        </Box>
    );
};
