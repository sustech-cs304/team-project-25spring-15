"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Markdown } from '../markdown';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import mocked_exercise from "@/app/mock/mocked-data";

const ExercisesRenderer = ({ exerciseContent, exerciseId, onBack }) => {
  // 使用传入的内容或默认内容
  const content = exerciseContent || "# 练习内容未找到";

  return (
    <Box sx={{ p: 2 }}>
      {/* 添加返回按钮和标题 */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          variant="outlined"
          sx={{ mr: 2 }}
        >
          返回列表
        </Button>
        <Typography variant="h5">练习 {exerciseId}</Typography>
      </Box>

      {/* Markdown内容区 */}
      <Box>
        {/* <Typography variant="h6" gutterBottom>
                练习区域
            </Typography>
            <Typography>
                在这里列出所有练习题，或者显示选中练习的详细内容。
            </Typography> */}
        <Box
          sx={{
            "& table": { width: "100%", borderCollapse: "collapse" },
            "& th, & td": { border: "1px solid #e0e0e0", padding: "8px" },
          }}
        >
          <Markdown>{mocked_exercise}</Markdown>
        </Box>
      </Box>

      {/* 添加提交按钮 */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary">
          提交答案
        </Button>
      </Box>
    </Box>
  );
};

export default ExercisesRenderer;
