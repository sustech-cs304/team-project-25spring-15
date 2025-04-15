// src/components/CourseIDE/NotebookTabs.jsx
import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import NotesSection from './NotesSection';
import ExercisesView from './ExercisesView';

const NotebookTabs = () => {
    // 0 表示笔记，1 表示练习
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            {/* 选项卡栏 */}
            <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="笔记" />
                <Tab label="练习" />
            </Tabs>

            {/* 内容区域 */}
            {tabValue === 0 && (
                <Box sx={{ p: 2, height: 'calc(100% - 48px)' }}>
                    <NotesSection />
                </Box>
            )}
            {tabValue === 1 && (
                <Box sx={{ p: 2, height: 'calc(100% - 48px)' }}>
                    <ExercisesView />
                </Box>
            )}
        </Box>
    );
};

export default NotebookTabs;
