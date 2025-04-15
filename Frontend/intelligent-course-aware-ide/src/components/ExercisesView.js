// src/components/CourseIDE/ExercisesView.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import mocked_exercise from '../mock/data';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm';

const ExercisesView = () => {
    return (
        <Box>
            {/* <Typography variant="h6" gutterBottom>
                练习区域
            </Typography>
            <Typography>
                在这里列出所有练习题，或者显示选中练习的详细内容。
            </Typography> */}
            <Box sx={{ 
                '& table': { width: '100%', borderCollapse: 'collapse' },
                '& th, & td': { border: '1px solid #e0e0e0', padding: '8px' }
            }}>
                <Markdown remarkPlugins={[remarkGfm]}>
                    {mocked_exercise}
                </Markdown>
            </Box>
        </Box>
    );
};

export default ExercisesView;