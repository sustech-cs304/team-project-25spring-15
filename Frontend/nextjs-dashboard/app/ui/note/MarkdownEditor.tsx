'use client';

import React, { useRef } from 'react';
import { Box } from '@mui/material';
import '@mdxeditor/editor/style.css';
import {
  MDXEditor,
  headingsPlugin,
  codeBlockPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin,
} from '@mdxeditor/editor';

interface MarkdownEditorProps {
  value: string;
  onChange: (markdown: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<React.ElementRef<typeof MDXEditor>>(null);

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
          padding: '16px',
        },
        // 标题样式
        '& .prose h1': { fontSize: '2rem', fontWeight: 700, margin: '16px 0' },
        '& .prose h2': { fontSize: '1.75rem', fontWeight: 600, margin: '14px 0' },
        '& .prose h3': { fontSize: '1.5rem', fontWeight: 500, margin: '12px 0' },
        '& .prose h4': { fontSize: '1.25rem', fontWeight: 500, margin: '10px 0' },
        '& .prose h5': { fontSize: '1.125rem', fontWeight: 500, margin: '8px 0' },
        '& .prose h6': { fontSize: '1rem', fontWeight: 500, margin: '6px 0' },
        // 有序列表样式
        '& .prose ol': {
          paddingLeft: '1.5em',
          margin: '8px 0',
          listStyleType: 'decimal',
        },
        '& .prose ol li': {
          marginBottom: '0.5em',
        },
        // 无序列表样式
        '& .prose ul': {
          paddingLeft: '1.5em',
          margin: '8px 0',
          listStyleType: 'disc',
        },
        '& .prose ul li': {
          marginBottom: '0.5em',
        },
      }}
    >
      <MDXEditor
        ref={editorRef}
        markdown={value || '# 开始编辑...'}
        onChange={(newMd: string) => onChange(newMd)}
        plugins={[
          headingsPlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: 'javascript' }),
          listsPlugin(),
          markdownShortcutPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
        ]}
        contentEditableClassName="prose"
      />
    </Box>
  );
};

export default MarkdownEditor;
