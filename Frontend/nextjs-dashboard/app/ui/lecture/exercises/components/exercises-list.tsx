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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Assignment } from "@/app/lib/definitions";

interface ExercisesListProps {
  exercises: Assignment[];
  onExerciseClick: (exerciseId: number) => void;
  onCreateClick: () => void;
  onEditClick: (ex: Assignment) => void;
  onDeleteClick: (exerciseId: number) => void;
  canEdit?: boolean;
}

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
  ":last-child": { borderBottom: "none" },
  cursor: "pointer",
  "&:hover": { backgroundColor: theme.palette.action.hover },
}));

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

  // 简单过滤示例：可根据实际字段扩展
  const filtered = exercises.filter((ex) => {
    if (searchText && !ex.assignmentName.includes(searchText)) return false;
    // TODO: 根据 tabValue 筛选
    return true;
  });

  console.log("Filtered exercises:", filtered);

  return (
    <TaskListContainer>
      <FilterTabsContainer>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
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
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </SearchContainer>
      </FilterTabsContainer>

      <Box>
        {filtered.map((ex) => (
          <TaskRow key={ex.assignmentId}>
            <Box sx={{ flexGrow: 1 }} onClick={() => onExerciseClick(ex.assignmentId)}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
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
              <Typography variant="body2" color="textSecondary">
                截止时间: {new Date(ex.deadline.replace(' ', 'T')).toLocaleString()}
              </Typography>
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
        ))}
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
