// src/components/CourseIDE/ExercisesView.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const ExercisesView = () => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                练习区域
            </Typography>
            <Typography>
                在这里列出所有练习题，或者显示选中练习的详细内容。
            </Typography>
        </Box>
    );
};

export default ExercisesView;