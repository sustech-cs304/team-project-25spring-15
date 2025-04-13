import React, { useState, useEffect } from 'react';
import {Box, Card} from '@mui/material';
import { styled } from '@mui/material/styles';
import Header from './Header';
import Sidebar from './Sidebar';
import ContentViewer from './ContentViewer';
import NotesSection from './NotesSection';
import axios from 'axios';  // 导入 axios

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
            <Box
                sx={{
                    width: 250,
                    height: '100vh',
                    position: 'relative',
                    zIndex: 1,
                    marginTop: '64px',
                }}
            >
                <Sidebar courses={courses} />
            </Box>
            <Box sx={{ flexGrow: 1, mt: 8, ml: 8 }}>
                <ContentContainer>
                    <ContentViewer file="C:\Users\ASUS\Desktop\Undergraduate Students Declaration Form (2)(1).pdf" />
                    <Card sx={{ flexGrow: 1, height: '100vh', overflow: 'hidden' }}>
                        <NotesSection />
                    </Card>
                </ContentContainer>
            </Box>
        </MainContainer>
    );
};

export default CourseIDE;
