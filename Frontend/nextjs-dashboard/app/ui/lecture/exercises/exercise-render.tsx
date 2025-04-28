"use client";
import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import MarkdownEditor from '@/app/ui/note/MarkdownEditor';
import CodeEditor from '@/app/ui/note/CodeEditor';
import { RunIcon } from '@codesandbox/sandpack-react';

interface Assignment {
  assignmentId: number;
  publisherId: number;
  title: string;
  description: string;
  deadLine: string;
  completeness: number;
}

interface ExercisePageProps {
  assignmentId: number;
  onBack: () => void;
}

export default function ExercisePage({ assignmentId, onBack }: ExercisePageProps) {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState<string>("// 在此编写代码");
  const [output, setOutput] = useState<string>("");

  useEffect(() => {
    axios
      .get<Assignment>('https://m1.apifoxmock.com/m1/5989566-5677982-default/api/getExercise')
      .then((res) => setAssignment(res.data))
      .catch((err) => console.error('加载练习失败', err))
      .finally(() => setLoading(false));
  }, [assignmentId]);

  const handleRun = () => {
    try {
      // 简易 JS eval
      // eslint-disable-next-line no-eval
      const result = eval(code);
      setOutput(String(result));
    } catch (err: any) {
      setOutput(err.message);
    }
  };

  const handleSubmit = () => {
    axios.post('/api/submissions', { assignmentId, code })
      .catch((err) => console.error('提交失败', err));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!assignment) {
    return <Box sx={{ p: 2 }}>未能加载练习内容</Box>;
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton edge="start" onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2 }}>
            {assignment.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        {/* 左侧练习描述 */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            borderRight: '1px solid #e0e0e0',
            overflow: 'auto',
            minHeight: 0,
          }}
        >
          <MarkdownEditor value={assignment.description} onChange={() => {}} />
        </Box>

        {/* 右侧代码区 */}
        <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'auto' }}>
          <Typography variant="subtitle1">代码编辑</Typography>
          <CodeEditor value={code} language="javascript" onChange={setCode} />
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button variant="outlined" onClick={handleRun} startIcon={<RunIcon />}>运行</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>提交答案</Button>
          </Box>
          {output !== "" && (
            <Box sx={{ mt: 2, flex: 1, overflow: 'auto', backgroundColor: '#f5f5f5', p: 1, borderRadius: 1, minHeight: 0 }}>
              <Typography component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                {output}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
