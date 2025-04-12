// src/components/CourseIDE/CourseIDE.jsx
import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Header from './Header';
import Sidebar from './Sidebar';
import ContentViewer from './ContentViewer';
import NotesSection from './NotesSection';

const MainContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f5f5f5',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(2),
    display: 'flex',
    gap: theme.spacing(2),
}));

// 示例课程数据
const courses = [
    {
        id: 1,
        title: "软件工程",
        expanded: true,
        lectures: [
            { id: 1, title: "软件工程简介", selected: true },
            { id: 2, title: "Maven介绍" },
            { id: 3, title: "需求分析" }
        ]
    },
    {
        id: 2,
        title: "数据库原理",
        expanded: false,
        lectures: []
    },
    {
        id: 3,
        title: "操作系统",
        expanded: false,
        lectures: []
    }
];

const CourseIDE = () => {
    return (
        <MainContainer>
            <Header />
            <Sidebar courses={courses} />
            <Box sx={{ flexGrow: 1, mt: 8 }}>
                <ContentContainer>
                    <ContentViewer file="C:\Users\ASUS\Desktop\Undergraduate Students Declaration Form (2)(1).pdf"/>
                    <Box sx={{ flexGrow: 1, height: '100vh', overflow: 'hidden' }}>
                        <NotesSection />
                    </Box>
                </ContentContainer>
            </Box>
        </MainContainer>
    );
};

export default CourseIDE;
