'use client';

import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ChatIcon from "@mui/icons-material/Chat";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PsychologyIcon from "@mui/icons-material/Psychology";

export default function ContentTabs() {
  const router = useRouter();
  const pathname = usePathname();

  // 从 URL 路径确定当前标签
  const getTabFromPath = () => {
    if (pathname.includes('/courseware')) return 0;
    if (pathname.includes('/exercises')) return 1;
    if (pathname.includes('/comments')) return 2;
    if (pathname.includes('/ai')) return 3;
    if (pathname.includes('/collab')) return 4;
    return false; // 默认不选中任何标签
  };

  const [tabValue, setTabValue] = useState<number | false>(getTabFromPath);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);

    // 根据标签值导航到对应的子路径
    const basePath = pathname.split('/').slice(0, 4).join('/'); // /dashboard/[courseId]/[lectureId]

    let targetPath = basePath;
    switch (newValue) {
      case 0:
        targetPath = `${basePath}/courseware`;
        break;
      case 1:
        targetPath = `${basePath}/exercises`;
        break;
      case 2:
        targetPath = `${basePath}/comments`;
        break;
      case 3:
        targetPath = `${basePath}/ai`;
        break;
      case 4:
        targetPath = `${basePath}/collab`;
        break;
    }

    router.push(targetPath);
  };

  return (
    <Box sx={{
      width: '100%',
      borderBottom: 1,
      borderColor: 'divider'
    }}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tab icon={<PictureAsPdfIcon />} label="课件" />
        <Tab icon={<AssignmentIcon />} label="练习" />
        <Tab icon={<ChatIcon />} label="评论" />
        <Tab icon={<SmartToyIcon />} label="AI" />
        <Tab icon={<PsychologyIcon />} label="头脑风暴" />
      </Tabs>
    </Box>
  );
}
