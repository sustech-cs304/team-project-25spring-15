import React from 'react';
import { Box } from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { autocompletion } from '@codemirror/autocomplete';

interface CodeEditorProps {
  /** 编辑器中的代码文本 */
  value: string;
  /** 编程语言，用于选择语法高亮 */
  language: string;
  /** 代码内容变化回调 */
  onChange?: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, language, onChange }) => {
  // 根据语言动态选择 CodeMirror 语言扩展，这里默认使用 javascript
  const languageExtension =
    language.toLowerCase() === 'javascript' ? javascript() : javascript();

  return (
    <Box>
      <CodeMirror
        value={value}
        height="200px"
        extensions={[languageExtension, autocompletion()]}
        onChange={(newValue: string) => {
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
