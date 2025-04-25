'use client';

import { ReactNode } from "react";
import { Box, Card } from "@mui/material";
import { styled } from "@mui/material/styles";
import ContentTabs from "@/app/ui/lecture/content-link"; // 导入标签栏组件

export const experimental_ppr = true;

// 内容容器样式
const ContentContainer = styled(Box)(({ theme }) => ({
  height: "calc(100% - 48px)",
  overflow: "auto",
  padding: theme.spacing(2),
}));

interface LectureLayoutProps {
  children: ReactNode;
}

export default function LectureLayout({ children }: LectureLayoutProps) {
  return (
    <div>
      <Card
        sx={{
          flexGrow: 1,
          height: "calc(94vh - 64px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: "10px",
          border: "2px solid #e0e0e0",
          borderRadius: "8px",
        }}
      >
        {/* 顶部标签栏 */}
        <ContentTabs />

        {/* 内容区域 - 渲染子路由 */}
        <ContentContainer>
          {children}
        </ContentContainer>
      </Card>
    </div>
  );
}
