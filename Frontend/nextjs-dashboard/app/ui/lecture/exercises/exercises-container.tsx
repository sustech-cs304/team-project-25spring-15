// file: exercises-container.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import axios from "axios";
import ExercisesRenderer from "./components/exercise-render";
import ExercisesList from "./components/exercises-list";
import TaskForm from "./components/task-form"; // 假设 TaskForm 也被抽离到单独文件

// 列表接口结构
interface ExerciseSummary {
  exerciseId: number;
  publisherId: 0;
  title: string;
  description: string;
  deadline: string;
  score: number;
}

export default function ExercisesContainer() {
  const [exercises, setExercises] = useState<ExerciseSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editExercise, setEditExercise] = useState<ExerciseSummary | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const res = await axios.get<{ exercises: ExerciseSummary[] }>("/api/exercises");
      setExercises(res.data.exercises);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleCreate = (data: { title: string; description: string; deadline: string }) => {
    axios.post("/api/exercises", data).then(() => {
      setShowCreate(false);
      fetchExercises();
    });
  };

  const handleDelete = (id: number) => {
    axios.delete(`/api/exercises/${id}`).then(() => fetchExercises());
  };

  const handleEdit = (ex: ExerciseSummary) => {
    setEditExercise(ex);
    setShowEdit(true);
  };

  const handleUpdate = (data: { title: string; description: string; deadline: string }) => {
    if (!editExercise) return;
    axios.put(`/api/exercises/${editExercise.exerciseId}`, data).then(() => {
      setShowEdit(false);
      setEditExercise(null);
      fetchExercises();
    });
  };

  const handleView = (id: number) => setSelectedId(id);
  const handleBack = () => setSelectedId(null);

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
        <ExercisesRenderer assignmentId={selectedId} onBack={handleBack} />
      ) : (
        <ExercisesList
          exercises={exercises}
          onExerciseClick={handleView}
          onCreateClick={() => setShowCreate(true)}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
        />
      )}
    </Box>
  );
}
