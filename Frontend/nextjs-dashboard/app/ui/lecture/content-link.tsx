'use client';

import { useState } from "react";
import { Box, Card, Tabs, Tab, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ChatIcon from "@mui/icons-material/Chat";
import SmartToyIcon from "@mui/icons-material/SmartToy";

// 引入可能的内容组件
import CoursewareView from "./courseware-view";
import ExercisesContainer from "./exercises-container";
import CommentView from "./comment-view";
import AIAssistantView from "./ai-view";

// 如果需要自定义样式
const ContentContainer = styled(Box)(({ theme }) => ({
  height: "calc(100% - 48px)",
  overflow: "auto",
  padding: theme.spacing(2),
}));

export default function ContentLink() {
  // 用于表示当前选中的"课件 / 练习 / 讨论 / AI"，0=课件, 1=练习, 2=讨论, 3=AI
  const [tabValue, setTabValue] = useState<number>(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <Card
        sx={{
          flexGrow: 1,
          height: "calc(94vh - 64px)",
          overflow: "auto",
          padding: "10px",
          borderColor: `2px solid #e0e0e0`,
          borderRadius: "8px",  // 增加一点圆角
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab icon={<PictureAsPdfIcon />} label="课件" />
          <Tab icon={<AssignmentIcon />} label="练习" />
          <Tab icon={<ChatIcon />} label="评论" />
          <Tab icon={<SmartToyIcon />} label="AI" />
        </Tabs>

        {/* 根据 tabValue 显示不同视图 */}
        <AnimatePresence mode="wait">
          {tabValue === 0 && (
            <motion.div
              key="courseware"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ContentContainer>
                <CoursewareView />
              </ContentContainer>
            </motion.div>
          )}

          {tabValue === 1 && (
            <motion.div
              key="exercises"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ContentContainer>
                <ExercisesContainer />
              </ContentContainer>
            </motion.div>
          )}

          {tabValue === 2 && (
            <motion.div
              key="comments"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ContentContainer>
                <CommentView />
              </ContentContainer>
            </motion.div>
          )}

          {tabValue === 3 && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ContentContainer>
                <AIAssistantView />
              </ContentContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
