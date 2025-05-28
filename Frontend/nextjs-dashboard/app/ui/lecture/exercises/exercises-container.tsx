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
      alert('您没有权限创建任务');
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
      })
      .catch((err) => console.error("创建作业失败", err));
  };

  const handleDelete = (id: number) => {
    if (!permissions.canEditExercise) {
      alert('您没有权限删除任务');
      return;
    }
    if (!window.confirm("确定要删除这个作业吗？")) return;
    AssignmentAPI.deleteAssignment(id, selectedCourseId || 0)
      .then(() => fetchExercises())
      .catch((err) => console.error("删除作业失败", err));
  };

  const handleEdit = (ex: Assignment) => {
    if (!permissions.canEditExercise) {
      alert('您没有权限编辑任务');
      return;
    }
    setEditExercise(ex);
    setShowEdit(true);
  };

  const handleUpdate = (data: { assignmentName: string; description: string; deadline: string }) => {
    if (!permissions.canEditExercise) {
      alert('您没有权限更新任务');
      return;
    }
    if (!editExercise) return;
    axios.put(`/api/exercises/${editExercise.assignmentId}`, data).then(() => {
      setShowEdit(false);
      setEditExercise(null);
      fetchExercises();
    });
  };

  const handleView = (id: number) => setSelectedId(id);
  const handleBack = () => setSelectedId(0);

  const handleCreateClick = () => {
    if (!permissions.canEditExercise) {
      alert('您没有权限创建任务');
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
          initial={editExercise}
          onClose={() => setShowEdit(false)}
          onSubmit={handleUpdate}
        />
      )}

      {selectedId ? (
        <ExercisesRenderer
          assignment={exercises.find(ex => ex.assignmentId === selectedId)!}
          onBack={handleBack}
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
    </Box>
  );
}
