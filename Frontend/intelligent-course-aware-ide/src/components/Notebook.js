import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Code } from '@mui/icons-material';
import CodeEditor from '@uiw/react-textarea-code-editor';

const Notebook = () => {
    const [notes, setNotes] = useState(() => localStorage.getItem('notes') || '');
    const [code, setCode] = useState(() => localStorage.getItem('code') || 'console.log("Hello, World!");');
    const [output, setOutput] = useState('');

    useEffect(() => {
        localStorage.setItem('notes', notes);
        localStorage.setItem('code', code);
    }, [notes, code]);

    const runCode = () => {
        try {
            const result = eval(code);
            setOutput(result !== undefined ? result.toString() : '代码执行成功');
        } catch (err) {
            setOutput(err.toString());
        }
    };

    return (
        <Box sx={{ width: 400, p: 3, borderLeft: '1px solid #ddd', height: 'calc(100vh - 64px)', overflow: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Code sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">代码笔记本</Typography>
                <Button variant="contained" size="small" sx={{ ml: 'auto' }} onClick={runCode}>
                    运行
                </Button>
            </Box>

            <TextField
                fullWidth
                multiline
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="记录你的笔记..."
                variant="outlined"
                sx={{ mb: 3 }}
            />

            <Box sx={{ mb: 3 }}>
                <CodeEditor
                    value={code}
                    language="javascript"
                    placeholder="请输入 JavaScript 代码"
                    onChange={(e) => setCode(e.target.value)}
                    padding={15}
                    style={{
                        fontSize: 14,
                        backgroundColor: '#f5f6fa',
                        fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
                        borderRadius: 4,
                    }}
                />
            </Box>

            {output && (
                <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, whiteSpace: 'pre-wrap' }}>
                    <Typography variant="subtitle2">运行结果:</Typography>
                    <Typography variant="body2">{output}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default Notebook;
