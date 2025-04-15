// src/components/CourseIDE/MarkdownEditor.jsx
import React from 'react';
import { Box } from '@mui/material';
import '@mdxeditor/editor/style.css';
import { MDXEditor, headingsPlugin, codeBlockPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, thematicBreakPlugin } from '@mdxeditor/editor'

const MarkdownEditor = ({ value, onChange }) => {
    const editorRef = React.useRef(null);
    return (
        <Box
            sx={{
                height: 'calc(100vh - 120px)',
                width: '100%',
                overflow: 'auto',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                '& .prose': {
                    minHeight: '100%',
                    padding: '16px'
                }
            }}
        >
            <MDXEditor
                ref={editorRef}
                markdown={value || '# 开始编辑...'}
                onChange={console.log}
                plugins={[
                    headingsPlugin(),
                    codeBlockPlugin({
                        defaultCodeBlockLanguage: 'javascript'
                    }),
                    listsPlugin(),
                    markdownShortcutPlugin(),
                    quotePlugin(), 
                    thematicBreakPlugin()
                ]}
                contentEditableClassName="prose"
            />
        </Box>
    );
};

export default MarkdownEditor;
