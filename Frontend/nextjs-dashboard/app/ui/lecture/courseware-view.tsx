'use client';

import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";

const UpperBox = styled(Box)(({ theme }) => ({
  height: "50%", // 上半部分高度
  overflow: "auto",
}));

const LowerBox = styled(Box)(({ theme }) => ({
  height: "50%", // 下半部分高度
  overflow: "auto",
}));

const CoursewareView = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <UpperBox>
        <p>PDF在这里显示</p>
      </UpperBox>

      <Divider />
    </Box>
  );
};

export default CoursewareView;
