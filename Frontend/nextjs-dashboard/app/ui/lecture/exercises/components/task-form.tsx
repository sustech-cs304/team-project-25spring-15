"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface TaskFormProps {
  initial?: { title: string; description: string; deadline: string };
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; deadline: string }) => void;
}

export default function TaskForm({ initial, onClose, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [deadline, setDeadLine] = useState(initial?.deadline || "");

  const handleSubmit = () => {
    onSubmit({ title, description, deadline });
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{initial ? "编辑任务" : "新建任务"}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="描述"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
          />
          <TextField
            label="截止日期"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadLine(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          确定
        </Button>
      </DialogActions>
    </Dialog>
  );
}
