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
                height: 'calc(100vh - 120px)',     // 设置固定高度
                width: '100%',       // 设置宽度为100%
                overflow: 'auto',    // 添加滚动条
                border: '1px solid #e0e0e0',  // 添加边框使滚动区域更加明显
                borderRadius: '4px', // 圆角边框
                '& .prose': {
                    minHeight: '100%',  // 确保编辑区域至少占满容器高度
                    padding: '16px'     // 内边距
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
