import React, { useState, useEffect } from 'react';
import { Box, Card, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import Header from './Header';
import Sidebar from './Sidebar';
import ContentViewer from './ContentViewer';
import NotesSection from './NotesSection';
import axios from 'axios';
import CoursewareView from './CoursewareView';  // 新建课件视图
import ExercisesView from './ExercisesView'; // 练习视图
import CommentView from './CommentView.js';
import { motion, AnimatePresence } from 'framer-motion';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChatIcon from '@mui/icons-material/Chat';

const MainContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    height: '100%',
    backgroundColor: '#f5f5f5',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(2),
    display: 'flex',
    gap: theme.spacing(2),
}));

const CourseIDE = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 用于表示当前选中的“课件 / 练习 / 代码”，0=课件,1=练习,2=代码
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const response = await axios.get('https://m1.apifoxmock.com/m1/5989566-5677982-default/api/getCourses');
                setCourses(response.data.courses);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, []);

    if (loading) {
        return <div>加载中...</div>;
    }

    if (error) {
        return <div>加载失败: {error}</div>;
    }

    return (
        <MainContainer>
            <Header />
            {/* 左侧侧边栏 */}
            <Box
                sx={{
                    width: 250,
                    height: '100vh',
                    position: 'relative',
                    zIndex: 1,
                    marginTop: '64px',  // Header 高度占位
                }}
            >
                <Sidebar courses={courses} />
            </Box>

            {/* 中间与右侧内容 */}
            <Box sx={{ flexGrow: 1, mt: 8, ml: 2 }}>
                <ContentContainer>
                    {/* 中间主要内容区 */}
                    <Card sx={{ flexGrow: 1, height: 'calc(100vh - 64px)', overflow: 'hidden', padding: '10px' }}>
                        {/* 顶部Tab切换，三按钮 */}
                        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tab icon={<PictureAsPdfIcon />} label="课件" />
                            <Tab icon={<AssignmentIcon />} label="练习" />
                            <Tab icon={<ChatIcon />} label="评论" />
                        </Tabs>
                        {/* 根据 tabValue 显示不同视图 */}
                        <AnimatePresence exitBeforeEnter>
                            {tabValue === 0 && (
                                <motion.div
                                    key="courseware"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Box sx={{ height: 'calc(100% - 48px)' }}>
                                        <CoursewareView />
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
                                    <Box sx={{ height: 'calc(100% - 48px)' }}>
                                        <ExercisesView />
                                    </Box>
                                </motion.div>
                            )}
                            {tabValue === 2 && (
                                <motion.div
                                    key="comment"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Box sx={{ height: 'calc(100% - 48px)' }}>
                                        <CommentView />
                                    </Box>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>

                    {/* 右侧的笔记区域 */}
                    <Card sx={{ flexGrow: 1, height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
                        <NotesSection />
                    </Card>
                </ContentContainer>
            </Box>
        </MainContainer>
    );
};

export default CourseIDE;
