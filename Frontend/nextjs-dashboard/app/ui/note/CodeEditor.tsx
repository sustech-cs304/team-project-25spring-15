import React from 'react';
import { Box } from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { autocompletion } from '@codemirror/autocomplete';

interface CodeEditorProps {
  value: string;
  language: string;
  onChange?: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, language, onChange }) => {
  const languageExtension =
    language.toLowerCase() === 'javascript' ? javascript() : javascript();

  return (
    <Box>
      <CodeMirror
        value={value}
        minHeight="470px"
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
