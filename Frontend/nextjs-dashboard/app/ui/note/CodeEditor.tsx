import React from 'react';
import { Box } from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { autocompletion } from '@codemirror/autocomplete';

interface CodeEditorProps {
  value: string;
  language: string;
  onChange?: (value: string) => void;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, language, onChange, height = '100%' }) => {
  const languageExtension =
    language.toLowerCase() === 'javascript' ? javascript() : javascript();

  return (
    <Box sx={{ height: '100%', overflow: 'hidden' }}>
      <CodeMirror
        value={value}
        height={height}
        extensions={[languageExtension, autocompletion()]}
        onChange={(newValue: string) => {
          if (onChange) onChange(newValue);
        }}
        style={{
          fontSize: 14,
          backgroundColor: '#fff',
          height: '100%',
        }}
      />
    </Box>
  );
};

export default CodeEditor;
