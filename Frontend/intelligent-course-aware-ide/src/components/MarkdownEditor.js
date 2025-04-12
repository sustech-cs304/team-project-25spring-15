// src/components/CourseIDE/MarkdownEditor.jsx
import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';

const MarkdownEditor = ({ value, onChange }) => {
    return (
        <Box>
            <TextField
                multiline
                fullWidth
                minRows={5}
                variant="outlined"
                value={value}
                onChange={(e) => {
                    if (onChange) onChange(e.target.value);
                }}
                placeholder="请输入 Markdown..."
                sx={{ mb: 2 }}
            />
            <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
                <Typography variant="h6" gutterBottom>
                    预览：
                </Typography>
                <ReactMarkdown>{value}</ReactMarkdown>
            </Box>
        </Box>
    );
};

export default MarkdownEditor;
