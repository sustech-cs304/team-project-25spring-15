"use client";
import React, { useState, useRef } from 'react';
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
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CodeEditor from '@/app/ui/note/CodeEditor';
import { getAuthHeader, CodeAPI, FileAPI } from '@/app/lib/client-api';
import { useStore } from '@/store/useStore';
import { Assignment } from '@/app/lib/definitions';

interface TestCase {
  id: number;
  name: string;
  input: File | null;
  output: File | null;
}

interface ExercisePageProps {
  assignment: Assignment;
  onBack: () => void;
}

export default function ExercisePage({ assignment, onBack }: ExercisePageProps) {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string>("// 在此编写代码");
  const [language, setLanguage] = useState<string>('javascript');
  const [output, setOutput] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [openTestDialog, setOpenTestDialog] = useState(false);
  const [newTestCase, setNewTestCase] = useState<TestCase>({
    id: 0,
    name: '',
    input: null,
    output: null
  });
  const inputFileRef = useRef<HTMLInputElement>(null);
  const outputFileRef = useRef<HTMLInputElement>(null);

  const userInfo = useStore((state) => state.userInfo);
  const selectedCourseId = useStore((state) => state.selectedCourseId);
  const selectedCourse = useStore(state =>
    state.courses.find(c => c.courseId === selectedCourseId)
  );

  const handleRun = async () => {
    if (!code.trim()) {
      setOutput("请先编写代码");
      return;
    }

    try {
      setRunning(true);
      setOutput('正在运行...');

      // 使用 CodeAPI 运行代码
      const result = await CodeAPI.runCode(code, language);
      setOutput(result || '程序执行完毕，无输出');
    } catch (err: any) {
      setOutput(`错误: ${err.message || '执行代码时发生未知错误'}`);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert("请先编写代码");
      return;
    }

    try {
      setRunning(true);
      // 提交代码到后端
      await axios.post(`/api/exercises/${assignment.assignmentId}/submit`, {
        code,
        language,
        userId: userInfo?.userId
      });
      alert("提交成功！");
    } catch (err: any) {
      alert(`提交失败: ${err.message || '发生未知错误'}`);
    } finally {
      setRunning(false);
    }
  };

  const handleOpenTestDialog = () => {
    setNewTestCase({
      id: 0,
      name: '',
      input: null,
      output: null
    });
    setOpenTestDialog(true);
  };

  const handleCloseTestDialog = () => {
    setOpenTestDialog(false);
  };

  const handleInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewTestCase({ ...newTestCase, input: e.target.files[0] });
    }
  };

  const handleOutputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewTestCase({ ...newTestCase, output: e.target.files[0] });
    }
  };

  const handleAddTestCase = async () => {
    if (!newTestCase.name || !newTestCase.input || !newTestCase.output) {
      alert("请填写测试样例名称并上传输入和输出文件");
      return;
    }

    try {
      setLoading(true);

      const inputResponse = await FileAPI.uploadFile(
        newTestCase.input,
        assignment.lectureId
      );

      const testcaseId = inputResponse.fileId;

      const outputResponse = await FileAPI.uploadFile(
        newTestCase.output,
        assignment.lectureId
      );

      const answerId = outputResponse.fileId;

      const headers = await getAuthHeader();

      const testcaseData = {
        testcaseAndAnswer: {
          assignmentId: assignment.assignmentId,
          publisherId: userInfo?.userId || 0,
          testcaseId: testcaseId,
          answerId: answerId,
          fileType: "txt"
        },
        courseId: assignment.courseId,
        courseName: selectedCourse?.courseName,
        chatId: selectedCourse?.chatId
      };

      await axios.post("/api/assignment/uploadTestcaseAndAnswer", testcaseData, {headers});

      alert("测试样例添加成功");
      handleCloseTestDialog();
    } catch (error) {
      console.error('添加测试样例失败', error);
      alert('添加测试样例失败: ' + (error instanceof Error ? error.message : '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton edge="start" onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2 }}>
            {assignment.assignmentName}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2" color="text.secondary">
            截止日期: {new Date(assignment.deadline).toLocaleString()} | 分值: {assignment.score}分
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* 左侧练习描述 */}
        <Box
          sx={{
            width: '45%',
            p: 2,
            borderRight: '1px solid #e0e0e0',
            overflow: 'auto',
          }}
        >
          <Paper sx={{ p: 3, height: '100%', overflow: 'auto' }}>
            <ReactMarkdown
              components={{
                // @ts-expect-error - ReactMarkdown类型定义问题
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      // @ts-expect-error - SyntaxHighlighter样式类型不匹配
                      style={materialDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {assignment.description}
            </ReactMarkdown>
          </Paper>
        </Box>

        {/* 右侧代码区 */}
        <Box sx={{ width: '55%', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto' }}>
            {/* 工具栏 - 固定高度 */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexShrink: 0 }}>
              <FormControl sx={{ minWidth: 140, mr: 2 }} size="small">
                <InputLabel id="language-select-label">编程语言</InputLabel>
                <Select
                  labelId="language-select-label"
                  value={language}
                  label="编程语言"
                  onChange={(e) => setLanguage(e.target.value as string)}
                >
                  <MenuItem value="javascript">JavaScript</MenuItem>
                  <MenuItem value="python">Python</MenuItem>
                  <MenuItem value="java">Java</MenuItem>
                  <MenuItem value="cpp">C++</MenuItem>
                  <MenuItem value="go">Go</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ flexGrow: 1 }} />
              {userInfo?.identity === 'teacher' && (
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleOpenTestDialog}
                  sx={{ mr: 1 }}
                >
                  添加测试样例
                </Button>
              )}
              <Button
                variant="outlined"
                onClick={handleRun}
                startIcon={<PlayArrowIcon />}
                disabled={running}
                sx={{ mr: 1 }}
              >
                运行
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                startIcon={<SendIcon />}
                disabled={running}
              >
                提交答案
              </Button>
            </Box>

            {/* 代码编辑器 - 固定高度，内部可滚动 */}
            <Box sx={{ 
              height: '400px', // 固定高度
              mb: 2, 
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              overflow: 'hidden',
              flexShrink: 0
            }}>
              <CodeEditor value={code} language={language} onChange={setCode} height="400px" />
            </Box>

            {/* 分割线 - 固定高度 */}
            <Divider sx={{ my: 1, flexShrink: 0 }} />

            {/* 运行结果标题 - 固定高度 */}
            <Typography variant="subtitle2" gutterBottom sx={{ flexShrink: 0 }}>
              运行结果
            </Typography>

            {/* 运行结果区域 - 固定高度 */}
            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                backgroundColor: '#f5f5f5',
                height: '150px',
                overflow: 'auto',
                fontFamily: 'monospace',
                flexShrink: 0
              }}
            >
              {running ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  <Typography>正在运行...</Typography>
                </Box>
              ) : (
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {output || '运行结果将显示在这里'}
                </pre>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* 添加测试样例对话框 */}
      <Dialog open={openTestDialog} onClose={handleCloseTestDialog} maxWidth="sm" fullWidth>
        <DialogTitle>添加测试样例</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="测试样例名称"
            fullWidth
            variant="outlined"
            value={newTestCase.name}
            onChange={(e) => setNewTestCase({ ...newTestCase, name: e.target.value })}
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" gutterBottom>
            输入文件
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<FileUploadIcon />}
            >
              上传输入文件
              <input
                ref={inputFileRef}
                type="file"
                hidden
                onChange={handleInputFileChange}
              />
            </Button>
            <Typography variant="body2" sx={{ ml: 2 }}>
              {newTestCase.input ? newTestCase.input.name : '未选择文件'}
            </Typography>
          </Box>

          <Typography variant="subtitle2" gutterBottom>
            输出文件
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<FileUploadIcon />}
            >
              上传输出文件
              <input
                ref={outputFileRef}
                type="file"
                hidden
                onChange={handleOutputFileChange}
              />
            </Button>
            <Typography variant="body2" sx={{ ml: 2 }}>
              {newTestCase.output ? newTestCase.output.name : '未选择文件'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTestDialog}>取消</Button>
          <Button onClick={handleAddTestCase} variant="contained">添加</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
