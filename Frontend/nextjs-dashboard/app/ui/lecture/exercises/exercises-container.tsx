// file: exercises-container.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import axios from "axios";
import ExercisesRenderer from "./components/exercise-render";
import ExercisesList from "./components/exercises-list";
import TaskForm from "./components/task-form";
import { AssignmentAPI } from "@/app/lib/client-api";
import { Assignment } from "@/app/lib/definitions";
import { useStore } from "@/store/useStore";
import { usePermissions } from "@/app/lib/permissions";
import { useMessage } from "@/app/hooks/useMessage";

export default function ExercisesContainer() {
  const [exercises, setExercises] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editExercise, setEditExercise] = useState<Assignment | null>(null);
  const [selectedId, setSelectedId] = useState<number | 0>(0);

  const userInfo = useStore((state) => state.userInfo);
  const selectedCourseId = useStore((state) => state.selectedCourseId);
  const selectedCourse = useStore(state =>
    state.courses.find(c => c.courseId === selectedCourseId)
  );
  const selectedLectureId = useStore((state) => state.selectedLectureId);
  const selectedLecture = selectedCourse?.lectures.find(l => l.lectureId === selectedLectureId);
  const courseIdentity = useStore(state => state.courseIdentity);

  // 使用权限管理工具
  const permissions = usePermissions(userInfo, selectedCourse?.teacherId, courseIdentity);
  
  // 使用消息弹窗
  const { success, error, warning, info, confirm, MessageComponent } = useMessage();

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const exercises = await AssignmentAPI.fetchAssignments(selectedLectureId); // 传入课程ID或其他参数
      setExercises(exercises);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleCreate = (data: { assignmentName: string; description: string; deadline: string }) => {
    if (!permissions.canEditExercise) {
      warning('您没有权限创建任务');
      return;
    }

    const newAssignment: Assignment = {
      assignmentName: data.assignmentName,
      description: data.description,
      deadline: new Date(data.deadline.replace(' ', 'T')).toISOString(),
      assignmentId: 0, // 服务器会返回实际ID
      courseId: selectedCourseId || 0,
      lectureId: selectedLectureId || 0,
      publisherId: userInfo?.userId || 0,
      score: 0,
    };
    AssignmentAPI.createAssignment(newAssignment, selectedCourse?.courseName, selectedCourse?.chatId)
      .then(() => {
        setShowCreate(false);
        fetchExercises();
        success('任务创建成功');
      })
      .catch((err) => {
        console.error("创建作业失败", err);
        error('创建任务失败');
      });
  };

  const handleDelete = (id: number) => {
    if (!permissions.canEditExercise) {
      warning('您没有权限删除任务');
      return;
    }
    
    confirm("确定要删除这个作业吗？", () => {
      AssignmentAPI.deleteAssignment(id, selectedCourseId || 0)
        .then(() => {
          fetchExercises();
          success('任务删除成功');
        })
        .catch((err) => {
          console.error("删除作业失败", err);
          error('删除任务失败');
        });
    });
  };

  const handleEdit = (ex: Assignment) => {
    if (!permissions.canEditExercise) {
      warning('您没有权限编辑任务');
      return;
    }
    setEditExercise(ex);
    setShowEdit(true);
  };

  const handleUpdate = (data: { assignmentName: string; description: string; deadline: string }) => {
    if (!permissions.canEditExercise) {
      warning('您没有权限更新任务');
      return;
    }
    if (!editExercise) return;
    
    // 注意：这里可能需要根据实际的API接口来调整
    const updatedAssignment = {
      ...editExercise,
      assignmentName: data.assignmentName,
      description: data.description,
      deadline: new Date(data.deadline.replace(' ', 'T')).toISOString(),
    };
    
    // 这里需要调用实际的更新API
    console.log("Updating assignment:", updatedAssignment);
    
    // 临时使用axios.put，实际应该调用AssignmentAPI.updateAssignment
    axios.put(`/api/exercises/${editExercise.assignmentId}`, updatedAssignment)
      .then(() => {
        setShowEdit(false);
        setEditExercise(null);
        fetchExercises();
        success('任务更新成功');
      })
      .catch((err) => {
        console.error("更新作业失败", err);
        error('更新任务失败');
      });
  };

  const handleView = (id: number) => setSelectedId(id);
  const handleBack = () => setSelectedId(0);

  const handleCreateClick = () => {
    if (!permissions.canEditExercise) {
      warning('您没有权限创建任务');
      return;
    }
    setShowCreate(true);
  };

  if (loading) return <Typography>加载中...</Typography>;

  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
      {showCreate && <TaskForm onClose={() => setShowCreate(false)} onSubmit={handleCreate} />}
      {showEdit && editExercise && (
        <TaskForm
          initial={{
            assignmentName: editExercise.assignmentName,
            description: editExercise.description,
            deadline: editExercise.deadline.replace('T', ' ').slice(0, -1), // 转换为datetime-local格式
          }}
          onClose={() => setShowEdit(false)}
          onSubmit={handleUpdate}
        />
      )}

      {selectedId ? (
        <ExercisesRenderer
          assignment={exercises.find(ex => ex.assignmentId === selectedId)!}
          onBack={handleBack}
          onRefresh={fetchExercises}
        />
      ) : (
        <ExercisesList
          exercises={exercises}
          onExerciseClick={handleView}
          onCreateClick={handleCreateClick}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
          canEdit={permissions.canEditExercise}
        />
      )}
      
      {/* 消息弹窗 */}
      <MessageComponent />
    </Box>
  );
}
