// file: ExercisesContainer.tsx

"use client";

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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReactMarkdown from "react-markdown";
import { initialTasks, exerciseContents } from "@/app/lib/mocked-data";
import ExercisesRenderer from "./exercise-render";
import axios from "axios";
import MarkdownEditor from "@/app/ui/note/MarkdownEditor";

interface ExercisesListProps {
  onExerciseClick: (taskId: number) => void;
  onCreateClick: () => void;               // 新增
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
  marginLeft: "auto",
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
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StatusLabel = styled(Typography)(({ theme, color }) => ({
  color: color || theme.palette.text.primary,
  fontSize: "0.875rem",
}));

function ExercisesList({ onExerciseClick, onCreateClick }: ExercisesListProps) {
  const [tabValue, setTabValue] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [tasks] = useState(initialTasks);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredTasks = tasks.filter((task) => {
    switch (tabValue) {
      case 1:
        if (task.isDone) return false;
        break;
      case 2:
        if (!task.isUrgent || task.isDone) return false;
        break;
      case 3:
        if (!task.isDone) return false;
        break;
    }
    if (searchText && !task.title.includes(searchText)) {
      return false;
    }
    return true;
  });

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

      <Box>
        {filteredTasks.map((task) => {
          let statusColor = "#555";
          if (task.status === "已逾期") statusColor = "red";
          else if (task.status === "今日截止") statusColor = "orange";
          else if (task.isDone) statusColor = "green";

          return (
            <TaskRow key={task.id} onClick={() => onExerciseClick(task.id)}>
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

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {`总计 ${total} 个任务，${undoneCount} 个待完成，${urgentCount} 个紧急`}
        </Typography>
        {/* 点击弹出创建对话框 */}
        <Button variant="contained" color="primary" onClick={onCreateClick}>
          新建任务
        </Button>
      </Box>
    </TaskListContainer>
  );
}

/** 创建任务的表单对话框 **/
interface CreateTaskFormProps {
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; deadLine: string }) => void;
}

function CreateTaskForm({ onClose, onSubmit }: CreateTaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadLine, setDeadLine] = useState("");

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>创建新任务</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
        <TextField
          label="截止时间"
          type="datetime-local"
          value={deadLine}
          onChange={(e) => setDeadLine(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Box sx={{ height: 300, overflow: "auto" }}>
          <MarkdownEditor value={description} onChange={(md) => setDescription(md)} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button
          variant="contained"
          onClick={() => onSubmit({ title, description, deadLine })}
          disabled={!title || !description || !deadLine}
        >
          提交
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ExercisesContainer() {
  const [showExerciseDetail, setShowExerciseDetail] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // 创建任务相关状态
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleExerciseClick = (exerciseId: number) => {
    const content = exerciseContents[exerciseId];
    setSelectedExercise({ id: exerciseId, content });
    setShowExerciseDetail(true);
  };

  const handleBackToList = () => {
    setShowExerciseDetail(false);
  };

  const handleOpenCreate = () => {
    setShowCreateForm(true);
  };
  const handleCloseCreate = () => {
    setShowCreateForm(false);
  };

  const handleCreateSubmit = async ({
                                      title,
                                      description,
                                      deadLine,
                                    }: {
    title: string;
    description: string;
    deadLine: string;
  }) => {
    const payload = {
      userId: 0,
      assignment: {
        assignmentId: 0,
        publisherId: 0,
        courseId: 0,
        lectureId: 0,
        title,
        description,
        deadLine,
        completeness: 0,
      },
    };

    try {
      console.log("提交的任务数据：", payload);
      const res = await axios.post("/api/assignments", payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 200 || res.status === 201) {
        // 提交成功，关闭表单或刷新列表
        setShowCreateForm(false);
      } else {
        console.error("创建任务失败，状态码：", res.status);
      }
    } catch (err) {
      console.error("创建任务出错：", err);
    }
  };

  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
      {/* 新建任务表单对话框 */}
      {showCreateForm && (
        <CreateTaskForm onClose={handleCloseCreate} onSubmit={handleCreateSubmit} />
      )}

      {showExerciseDetail ? (
        <ExercisesRenderer
          assignmentId={selectedExercise!.id!}
          onBack={handleBackToList}
        />
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <ExercisesList
            onExerciseClick={handleExerciseClick}
            onCreateClick={handleOpenCreate}  // 传入打开表单的函数
          />
        </Box>
      )}
    </Box>
  );
}
