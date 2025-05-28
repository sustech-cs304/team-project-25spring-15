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
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import axios from 'axios';
import CodeEditor from '@/app/ui/note/CodeEditor';
import { getAuthHeader, CodeAPI, FileAPI, AssignmentAPI } from '@/app/lib/client-api';
import { useStore } from '@/store/useStore';
import { Assignment } from '@/app/lib/definitions';
import Markdunner from "@/app/ui/lecture/courseware/markdunner-view";
import MarkdownWithRunner from "@/app/ui/lecture/courseware/markdown-with-runner";

interface TestCase {
  id: number;
  name: string;
  input: File | null;
  output: File | null;
}

interface SubmissionResult {
  feedbackId: number;
  performerId: number;
  assignmentId: number;
  score: number;
  record: string;
  fileId: string;
  fileType: string;
}

interface ExercisePageProps {
  assignment: Assignment;
  onBack: () => void;
}

export default function ExercisePage({ assignment, onBack }: ExercisePageProps) {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string>("// 在此编写代码");
  const [language, setLanguage] = useState<string>('c');
  const [output, setOutput] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [openTestDialog, setOpenTestDialog] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
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

    if (!userInfo?.userId) {
      alert("用户信息不完整");
      return;
    }

    try {
      setRunning(true);
      
      // 直接提交代码，不需要上传文件
      const attemptData = {
        userId: userInfo.userId,
        fileId: "0", // fileId不重要，传字符串"0"
        code: code, // 代码字符串
        fileType: language, // 编程语言
        assignmentId: assignment.assignmentId
      };

      console.log("Submitting assignment with data:", attemptData);
      const result = await AssignmentAPI.attemptAssignment(attemptData);
      console.log("Assignment attempt result:", result);

      // 保存提交结果
      setSubmissionResult(result);
      
      alert(`提交成功！总得分: ${result.score}分`);
    } catch (err: any) {
      console.error("Submit failed:", err);
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

      // 上传输入文件，后端会自动生成fileId
      const testcaseId = await FileAPI.uploadFile(newTestCase.input);

      // 上传输出文件，后端会自动生成fileId
      const answerId = await FileAPI.uploadFile(newTestCase.output);

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

      console.log("Adding testcase: ", testcaseData)

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
            <MarkdownWithRunner content={assignment.description} />
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
                  <MenuItem value="c">C</MenuItem>
                  <MenuItem value="cpp">C++</MenuItem>
                  <MenuItem value="python">Python</MenuItem>
                  <MenuItem value="txt">Txt</MenuItem>
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

            {/* 提交结果显示区域 */}
            {submissionResult && (
              <>
                <Divider sx={{ my: 1, flexShrink: 0 }} />
                <Typography variant="subtitle2" gutterBottom sx={{ flexShrink: 0 }}>
                  提交结果
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    backgroundColor: '#e8f5e8',
                    border: '1px solid #4caf50',
                    flexShrink: 0,
                    maxHeight: '200px',
                    overflow: 'auto'
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                      总得分: {submissionResult.score}分
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      反馈ID: {submissionResult.feedbackId}
                    </Typography>
                  </Box>
                  
                  {submissionResult.record && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        各测试点得分:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {submissionResult.record.split(',').map((score, index) => (
                          <Chip
                            key={index}
                            label={`测试点${index + 1}: ${score.trim()}分`}
                            color={parseInt(score.trim()) > 0 ? 'success' : 'error'}
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Paper>
              </>
            )}
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
