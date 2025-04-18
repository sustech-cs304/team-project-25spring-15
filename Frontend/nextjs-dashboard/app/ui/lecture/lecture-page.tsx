"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Card, Tabs, Tab } from "@mui/material";
import { styled } from "@mui/material/styles";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ChatIcon from "@mui/icons-material/Chat";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { motion, AnimatePresence } from "framer-motion";

// 导入组件
import CoursewareView from "@/app/ui/lecture/courseware-view";
import ExercisesContainer from "@/app/ui/lecture/exercises-container";
// import CommentView from '@/app/ui/CommentView';
// import AIAssistantView from '@/app/ui/AIAssistantView';
// import NotesSection from '@/app/ui/NotesSection';

const ContentContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  display: "flex",
  gap: theme.spacing(2),
}));

export default function CourseIDEPage() {
  const params = useParams();
  const { courseId, lectureId } = params as {
    courseId: string;
    lectureId: string;
  };

  // 用于表示当前选中的"课件 / 练习 / 讨论 / AI"，0=课件, 1=练习, 2=讨论, 3=AI
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 可以在这里添加获取特定课程和讲座内容的逻辑
  useEffect(() => {
    // 使用courseId和lectureId获取特定内容
    console.log(`Loading course ${courseId}, lecture ${lectureId}`);
    // 可以在这里调用API获取数据
  }, [courseId, lectureId]);

  return (
    <Box sx={{ flexGrow: 1, mt: 8, ml: 2 }}>
      <ContentContainer>
        <Card
          sx={{
            flexGrow: 1,
            height: "calc(100vh - 150px)",
            overflow: "hidden",
            padding: "10px",
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

          {/* 根据tabValue显示不同视图 */}
          <AnimatePresence mode="wait">
            {tabValue === 0 && (
              <motion.div
                key="courseware"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ height: "calc(100% - 48px)" }}>
                  <CoursewareView />
                  {/* courseId={courseId} lectureId={lectureId}  */}
                </Box>
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
                <Box sx={{ height: "calc(100% - 48px)", padding: "20px" }}>
                  <ExercisesContainer />
                </Box>
              </motion.div>
            )}
            {/*
          {tabValue === 2 && (
            <motion.div
              key="comment"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ height: 'calc(100% - 48px)' }}>
                <CommentView courseId={courseId} lectureId={lectureId} />
              </Box>
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
              <Box sx={{ height: 'calc(100% - 48px)' }}>
                <AIAssistantView courseId={courseId} lectureId={lectureId} />
              </Box>
            </motion.div>
          )} */}
          </AnimatePresence>
        </Card>

        {/* 右侧的笔记区域 */}
        {/* <Card sx={{ flexGrow: 1, height: 'calc(100vh - 150px)', overflow: 'hidden' }}>
        <NotesSection courseId={courseId} lectureId={lectureId} />
      </Card> */}
      </ContentContainer>
    </Box>
  );
}
