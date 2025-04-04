import React, {useEffect, useState} from 'react';
import { AppBar, Toolbar, Typography, Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Sidebar from './components/Sidebar';
import Preview from './components/Preview';
import Notebook from './components/Notebook';

const theme = createTheme({
    palette: {
        primary: { main: '#2E3B55' },
        secondary: { main: '#4CAF50' },
    },
    components: {
        MuiDrawer: {
            styleOverrides: { paper: { backgroundColor: '#f5f6fa' } },
        },
    },
});

const App = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('https://m1.apifoxmock.com/m1/5989229-5677644-default/courses');
                if (response.ok) {
                    const data = await response.json();
                    const courses = data.courses.map(course => ({
                        id: course.id,
                        title: course.title,
                        lectures: course.lectures.map(lecture => ({
                            id: lecture.id,
                            title: lecture.title,
                        }))
                    }));
                    console.log('Fetched courses data: ', courses);
                    setCourses(courses);
                } else {
                    console.error('Failed to fetch courses data');
                }
            } catch (error) {
                console.error('Error fetching courses data:', error);
            }
        };

        fetchCourses();
    }, []);

    const handleSelectLecture = async (lecture) => {
        try {
            setLoading(true); // 显示加载中
            // const response = await fetch(`https://your-backend-api.com/lectures/${lecture.id}/file`);
            // if (response.ok) {
            //     const data = await response.blob(); // 假设返回的是二进制文件数据
            // } else {
            //     console.error('Failed to fetch file data');
            // }
            console.log(`Selected lecture: ${lecture.title}`);
        } catch (error) {
            console.error('Error fetching file data:', error);
        } finally {
            setLoading(false); // 加载完成
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Sidebar courses={courses} onSelectLecture={handleSelectLecture} />
                <Box sx={{ flexGrow: 1, p: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Preview
                            // fileData={fileData}
                            loading={loading}
                        />
                        <Notebook />
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default App;
