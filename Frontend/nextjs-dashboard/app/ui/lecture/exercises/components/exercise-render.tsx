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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import MarkdownEditor from '@/app/ui/note/MarkdownEditor';
import CodeEditor from '@/app/ui/note/CodeEditor';
import { RunIcon } from '@codesandbox/sandpack-react';
import {Exercise} from "@/app/lib/definitions";

interface ExercisePageProps {
  assignmentId: number;
  onBack: () => void;
}

export default function ExercisePage({ assignmentId, onBack }: ExercisePageProps) {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState<string>("// 在此编写代码");
  const [language, setLanguage] = useState<string>('javascript');
  const [output, setOutput] = useState<string>("");

  useEffect(() => {
    axios
      .get<Exercise>('https://m1.apifoxmock.com/m1/5989566-5677982-default/api/getExercise')
      .then((res) => setExercise(res.data))
      .catch((err) => console.error('加载练习失败', err))
      .finally(() => setLoading(false));
  }, [assignmentId]);

  const handleRun = async () => {
    try {
      setOutput('正在运行...');
      const params = { language, code };
      const response = await axios.get('/pythonRunner', { params });
      const result = response.data.data?.result ?? '程序运行错误';
      setOutput(result);
    } catch (err: any) {
      setOutput(`错误: ${err.message}`);
    }
  };

  const handleSubmit = () => {
    axios.post('/api/submissions', { assignmentId, code, language })
      .catch((err) => console.error('提交失败', err));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!exercise) {
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
            {exercise.title}
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
          <MarkdownEditor value={exercise.description} onChange={() => {}} />
        </Box>

        {/* 右侧代码区 */}
        <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', height: '600px', overflow: 'auto' }}>
          <Typography variant="subtitle1">代码编辑</Typography>
          <FormControl sx={{ mt: 1, mb: 2, minWidth: 140 }} size="small">
            <InputLabel id="language-select-label">语言</InputLabel>
            <Select
              labelId="language-select-label"
              value={language}
              label="语言"
              onChange={(e) => setLanguage(e.target.value as string)}
            >
              <MenuItem value="javascript">JavaScript</MenuItem>
              <MenuItem value="python">Python</MenuItem>
              <MenuItem value="go">Go</MenuItem>
              <MenuItem value="java">Java</MenuItem>
              <MenuItem value="sql">SQL</MenuItem>
            </Select>
          </FormControl>
          <CodeEditor value={code} language={language} onChange={setCode} />
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
