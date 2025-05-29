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
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CircleIcon from "@mui/icons-material/Circle";
import { Assignment } from "@/app/lib/definitions";

interface ExercisesListProps {
  exercises: Assignment[];
  onExerciseClick: (exerciseId: number) => void;
  onCreateClick: () => void;
  onEditClick: (ex: Assignment) => void;
  onDeleteClick: (exerciseId: number) => void;
  canEdit?: boolean;
}

const filterOptions = ["全部", "待完成", "已完成", "紧急"];

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
  ":last-child": { borderBottom: "none" },
  cursor: "pointer",
  "&:hover": { backgroundColor: theme.palette.action.hover },
}));

// 获取任务状态
const getTaskStatus = (assignment: Assignment) => {
  const now = new Date();
  const deadline = new Date(assignment.deadline.replace(' ', 'T'));
  const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  // 判断是否完成
  const isCompleted = assignment.score > 0 && (
    !assignment.totalScore || assignment.score >= assignment.totalScore
  );
  
  if (isCompleted) {
    return 'completed'; // 已完成
  } else if (daysUntilDeadline <= 3 && daysUntilDeadline >= 0) {
    return 'urgent'; // 紧急（未完成且3天内到期）
  } else {
    return 'pending'; // 待完成
  }
};

// 获取状态标记的颜色和图标
const getStatusIndicator = (status: string) => {
  switch (status) {
    case 'completed':
      return { color: '#4caf50', label: '已完成', chipColor: 'success' as const };
    case 'urgent':
      return { color: '#f44336', label: '紧急', chipColor: 'error' as const };
    case 'pending':
      return { color: '#ff9800', label: '待完成', chipColor: 'warning' as const };
    default:
      return { color: '#9e9e9e', label: '未知', chipColor: 'default' as const };
  }
};

export default function ExercisesList({
                                        exercises,
                                        onExerciseClick,
                                        onCreateClick,
                                        onEditClick,
                                        onDeleteClick,
                                        canEdit = false,
                                      }: ExercisesListProps) {
  const [tabValue, setTabValue] = useState(0);
  const [searchText, setSearchText] = useState("");

  // 根据选择的标签页过滤任务
  const getFilteredExercises = () => {
    let filtered = exercises.filter((ex) => {
      // 搜索过滤
      if (searchText && !ex.assignmentName.toLowerCase().includes(searchText.toLowerCase())) {
        return false;
      }
      
      // 根据标签页过滤
      const status = getTaskStatus(ex);
      switch (tabValue) {
        case 0: // 全部
          return true;
        case 1: // 待完成
          return status === 'pending' || status === 'urgent';
        case 2: // 已完成
          return status === 'completed';
        case 3: // 紧急
          return status === 'urgent';
        default:
          return true;
      }
    });

    // 排序：紧急任务优先，然后按截止时间排序
    return filtered.sort((a, b) => {
      const statusA = getTaskStatus(a);
      const statusB = getTaskStatus(b);
      
      // 紧急任务排在最前面
      if (statusA === 'urgent' && statusB !== 'urgent') return -1;
      if (statusB === 'urgent' && statusA !== 'urgent') return 1;
      
      // 按截止时间排序
      const deadlineA = new Date(a.deadline.replace(' ', 'T'));
      const deadlineB = new Date(b.deadline.replace(' ', 'T'));
      return deadlineA.getTime() - deadlineB.getTime();
    });
  };

  const filtered = getFilteredExercises();

  // 计算各分类的数量
  const getCategoryCount = (category: number) => {
    return exercises.filter((ex) => {
      const status = getTaskStatus(ex);
      switch (category) {
        case 0: // 全部
          return true;
        case 1: // 待完成
          return status === 'pending' || status === 'urgent';
        case 2: // 已完成
          return status === 'completed';
        case 3: // 紧急
          return status === 'urgent';
        default:
          return true;
      }
    }).length;
  };

  return (
    <TaskListContainer>
      <FilterTabsContainer>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          {filterOptions.map((label, index) => (
            <Tab 
              key={label} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {label}
                  <Chip 
                    label={getCategoryCount(index)} 
                    size="small" 
                    sx={{ 
                      height: 20, 
                      fontSize: '0.75rem',
                      backgroundColor: index === tabValue ? 'primary.main' : 'grey.300',
                      color: index === tabValue ? 'white' : 'text.secondary'
                    }} 
                  />
                </Box>
              }
            />
          ))}
        </Tabs>
        <SearchContainer>
          <IconButton sx={{ p: "4px" }} disabled>
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="搜索任务..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </SearchContainer>
      </FilterTabsContainer>

      <Box>
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {searchText ? '没有找到匹配的任务' : '暂无任务'}
            </Typography>
          </Box>
        ) : (
          filtered.map((ex) => {
            const status = getTaskStatus(ex);
            const statusInfo = getStatusIndicator(status);
            const now = new Date();
            const deadline = new Date(ex.deadline.replace(' ', 'T'));
            const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <TaskRow key={ex.assignmentId}>
                {/* 状态指示器 */}
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                  <CircleIcon 
                    sx={{ 
                      fontSize: 12, 
                      color: statusInfo.color,
                      mr: 0.5
                    }} 
                  />
                  {tabValue === 0 && ( // 只在"全部"标签页显示状态标签
                    <Chip 
                      label={statusInfo.label}
                      size="small"
                      color={statusInfo.chipColor}
                      sx={{ 
                        height: 20, 
                        fontSize: '0.7rem',
                        fontWeight: 'medium'
                      }}
                    />
                  )}
                </Box>

                <Box sx={{ flexGrow: 1 }} onClick={() => onExerciseClick(ex.assignmentId)}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 'medium',
                        color: status === 'urgent' ? 'error.main' : 'text.primary'
                      }}
                    >
                      {ex.assignmentName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {ex.totalScore && ex.totalScore > 0 ? (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: ex.score > 0 ? 'success.main' : 'text.secondary',
                            fontWeight: 'medium'
                          }}
                        >
                          {Math.round((ex.score / ex.totalScore) * 100)}%
                        </Typography>
                      ) : (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary',
                            fontWeight: 'medium'
                          }}
                        >
                          未评分
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      截止时间: {deadline.toLocaleString()}
                    </Typography>
                    
                    {/* 倒计时显示 */}
                    {status !== 'completed' && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: status === 'urgent' ? 'error.main' : 'text.secondary',
                          fontWeight: status === 'urgent' ? 'bold' : 'normal'
                        }}
                      >
                        {daysUntilDeadline > 0 ? `还有${daysUntilDeadline}天` : 
                         daysUntilDeadline === 0 ? '今天截止' : 
                         `已逾期${Math.abs(daysUntilDeadline)}天`}
                      </Typography>
                    )}
                  </Box>
                  
                  {ex.totalScore && ex.totalScore > 0 && (
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box 
                        sx={{ 
                          flexGrow: 1, 
                          height: 4, 
                          backgroundColor: 'grey.200', 
                          borderRadius: 2,
                          overflow: 'hidden'
                        }}
                      >
                        <Box 
                          sx={{ 
                            height: '100%', 
                            backgroundColor: ex.score > 0 ? 'success.main' : 'grey.300',
                            width: `${Math.min((ex.score / ex.totalScore) * 100, 100)}%`,
                            transition: 'width 0.3s ease'
                          }} 
                        />
                      </Box>
                      <Typography variant="caption" color="textSecondary" sx={{ minWidth: 35 }}>
                        {ex.totalScore > 0 ? Math.round((ex.score / ex.totalScore) * 100) : 0}%
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                {canEdit && (
                  <>
                    <IconButton size="small" onClick={() => onEditClick(ex)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => onDeleteClick(ex.assignmentId)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
              </TaskRow>
            );
          })
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {canEdit && (
          <Button variant="contained" onClick={onCreateClick}>
            新建任务
          </Button>
        )}
      </Box>
    </TaskListContainer>
  );
}
