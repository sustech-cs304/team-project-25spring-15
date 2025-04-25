'use client';

import { ReactNode } from "react";
import { Card } from "@mui/material";
import ContentLinks from "@/app/ui/lecture/content-link"; // 导入标签栏组件

export const experimental_ppr = true;

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
        <ContentLinks />

        {/* 内容区域 - 渲染子路由 */}
        <div className="content-container">
          {children}
        </div>
      </Card>
    </div>
  );
}
