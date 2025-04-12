// src/components/CourseIDE/CodeEditor.jsx
import React from 'react';
import { Box } from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { autocompletion } from '@codemirror/autocomplete';

const CodeEditor = ({ value, language, onChange }) => {
    const languageExtension = language === 'javascript' ? javascript() : javascript();

    return (
        <Box>
            <CodeMirror
                value={value}
                height="200px"
                extensions={[languageExtension, autocompletion()]}
                onChange={(newValue) => {
                    if (onChange) onChange(newValue);
                }}
                style={{
                    fontSize: 14,
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                }}
            />
        </Box>
    );
};

export default CodeEditor;
