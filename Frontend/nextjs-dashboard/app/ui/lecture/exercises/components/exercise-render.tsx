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
import { usePermissions } from '@/app/lib/permissions';
import { useMessage } from '@/app/hooks/useMessage';

interface TestCase {
  id: number;
  name: string;
  input: File | null;
  output: File | null;
  score: number;
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
  onRefresh?: () => void;
}

export default function ExercisePage({ assignment, onBack, onRefresh }: ExercisePageProps) {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string>("// 在此编写代码");
  const [language, setLanguage] = useState<string>('c');
  const [output, setOutput] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [openTestDialog, setOpenTestDialog] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [newTestCase, setNewTestCase] = useState<TestCase>({
    id: 0,
    name: '',
    input: null,
    output: null,
    score: 0
  });
  const inputFileRef = useRef<HTMLInputElement>(null);
  const outputFileRef = useRef<HTMLInputElement>(null);

  const userInfo = useStore((state) => state.userInfo);
  const selectedCourseId = useStore((state) => state.selectedCourseId);
  const selectedCourse = useStore(state =>
    state.courses.find(c => c.courseId === selectedCourseId)
  );
  const courseIdentity = useStore(state => state.courseIdentity);

  // 使用权限管理工具
  const permissions = usePermissions(userInfo, selectedCourse?.teacherId, courseIdentity);
  
  // 使用消息弹窗
  const { success, error, warning, info, confirm, MessageComponent } = useMessage();

  const handleRun = async () => {
    if (!code.trim()) {
      warning("请先编写代码");
      return;
    }

    try {
      setRunning(true);
      setOutput('正在运行...');

      // 使用 CodeAPI 运行代码
      const result = await CodeAPI.runCode(code, language);
      
      // 确保有结果显示
      if (result !== undefined && result !== null) {
      setOutput(result);
      } else {
        setOutput('程序执行完毕，无输出');
      }
    } catch (err: any) {
      setOutput(`错误: ${err.message || '执行代码时发生未知错误'}`);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      warning("请先编写代码");
      return;
    }

    if (!userInfo?.userId) {
      error("用户信息不完整");
      return;
    }

    try {
      setRunning(true);

      const attemptData = {
        userId: userInfo.userId,
        fileId: "0",
        code: code,
        fileType: language === 'python' ? 'py' : language,
        assignmentId: assignment.assignmentId
      };

      const result = await AssignmentAPI.attemptAssignment(attemptData);
      
      // 验证返回的数据结构
      if (!result) {
        error("提交失败：服务器返回空结果");
        return;
      }
      
      if (typeof result.score === 'undefined') {
        error("提交失败：服务器返回的数据格式不正确");
        return;
      }

      // 保存提交结果
      setSubmissionResult(result);

      // 手动更新assignment的score以更新右上角完成度显示
      assignment.score = result.score;
      
      // 强制重新渲染以更新右上角完成度显示
      setForceUpdate(prev => prev + 1);

      const totalScore = assignment.totalScore || 0;
      const percentage = totalScore > 0 ? Math.round((result.score / totalScore) * 100) : 0;
      
      // 解析测试样例结果
      let detailMessage = '';
      if (result.record && result.record.trim()) {
        const cleanRecord = result.record.trim().replace(/,$/, ''); // 去掉末尾的逗号
        const scores = cleanRecord.split(',').map((s: string) => parseInt(s.trim()));
        const passCount = scores.filter((s: number) => s > 0).length;
        const totalCount = scores.length;
        detailMessage = `\n测试样例: 通过 ${passCount}/${totalCount} 个`;
      }
      
      // 显示成功消息
      if (totalScore > 0) {
        success(`🎉 提交成功！\n\n得分: ${result.score}分 (${percentage}%)${detailMessage}`, {
          title: '提交成功'
        });
      } else {
        success(`🎉 提交成功！\n\n得分: ${result.score}分${detailMessage}`, {
          title: '提交成功'
        });
      }
      
      // 暂时注释掉onRefresh，避免代码被清空
      // onRefresh?.();
    } catch (err: any) {
      error(`提交失败: ${err.message || '发生未知错误'}`);
    } finally {
      setRunning(false);
    }
  };

  const handleOpenTestDialog = () => {
    setNewTestCase({
      id: 0,
      name: '',
      input: null,
      output: null,
      score: 10 // 默认分值
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
    if (!permissions.canAddTestCase) {
      warning("您没有权限添加测试样例");
      return;
    }

    if (!newTestCase.name || !newTestCase.input || !newTestCase.output) {
      warning("请填写测试样例名称并上传输入和输出文件");
      return;
    }

    if (newTestCase.score <= 0) {
      warning("测试样例分值必须大于0");
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
          fileType: "txt",
          score: newTestCase.score // 包含测试样例分值
        },
        courseId: assignment.courseId,
        courseName: selectedCourse?.courseName,
        chatId: selectedCourse?.chatId
      };

      await axios.post("/api/assignment/uploadTestcaseAndAnswer", testcaseData, {headers});

      success(`测试样例添加成功，分值：${newTestCase.score}分`);
      handleCloseTestDialog();
      onRefresh?.();
    } catch (err) {
      error('添加测试样例失败: ' + (err instanceof Error ? err.message : '未知错误'));
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              截止日期: {new Date(assignment.deadline).toLocaleString()}
            </Typography>
            {assignment.totalScore && assignment.totalScore > 0 && assignment.score >= 0 && (
              <>
                <Divider orientation="vertical" flexItem />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: assignment.score > 0 ? 'success.main' : 'text.secondary',
                    fontWeight: 'medium'
                  }}
                >
                  完成度: {Math.round((assignment.score / assignment.totalScore) * 100)}%
                </Typography>
              </>
            )}
          </Box>
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
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%', 
            overflow: 'auto' // 允许整个区域滚动
          }}>
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
              {permissions.canAddTestCase && (
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
              height: '300px', // 减少高度从400px到300px，为提交结果留出空间
              mb: 2,
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              overflow: 'hidden',
              flexShrink: 0
            }}>
              <CodeEditor value={code} language={language} onChange={setCode} height="300px" />
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
                height: '100px', // 减少高度从150px到100px，为提交结果留出空间
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
                  🎉 提交结果
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    backgroundColor: submissionResult.score > 0 ? '#e8f5e8' : '#fff3e0',
                    border: `1px solid ${submissionResult.score > 0 ? '#4caf50' : '#ff9800'}`,
                    flexShrink: 0,
                    mb: 2 // 添加底部边距确保可见
                  }}
                >
                  {/* 总得分显示 */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ 
                      color: submissionResult.score > 0 ? 'success.main' : 'warning.main', 
                      fontWeight: 'bold',
                      mb: 1
                    }}>
                      总得分: {submissionResult.score}分
                    </Typography>
                    
                    {assignment.totalScore && assignment.totalScore > 0 && (
                      <Typography variant="body2" sx={{ 
                        color: 'text.primary',
                        mb: 1
                      }}>
                        完成度: {Math.round((submissionResult.score / assignment.totalScore) * 100)}% ({submissionResult.score}/{assignment.totalScore})
                      </Typography>
                    )}
                    
                    <Typography variant="body2" color="text.secondary">
                      反馈ID: {submissionResult.feedbackId}
                    </Typography>
                  </Box>

                  {/* 测试样例详细得分 */}
                  {submissionResult.record && submissionResult.record.trim() && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                        测试样例详情:
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {(() => {
                          const cleanRecord = submissionResult.record.trim().replace(/,$/, ''); // 去掉末尾的逗号
                          return cleanRecord.split(',').map((score, index) => {
                            const testScore = parseInt(score.trim());
                            const isPass = testScore > 0;
                            return (
                              <Box 
                                key={index}
                                sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 1,
                                  p: 1,
                                  borderRadius: 1,
                                  backgroundColor: isPass ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                  border: `1px solid ${isPass ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`,
                                  minWidth: 'fit-content'
                                }}
                              >
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  测试点{index + 1}:
                                </Typography>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontWeight: 'bold',
                                    color: isPass ? 'success.dark' : 'error.dark'
                                  }}
                                >
                                  {testScore}分
                                </Typography>
                                <Box 
                                  sx={{ 
                                    width: 8, 
                                    height: 8, 
                                    borderRadius: '50%',
                                    backgroundColor: isPass ? 'success.main' : 'error.main'
                                  }}
                                />
                              </Box>
                            );
                          });
                        })()}
                      </Box>
                      
                      {/* 统计信息 */}
                      <Typography variant="body2" color="text.secondary">
                        {(() => {
                          const cleanRecord = submissionResult.record.trim().replace(/,$/, ''); // 去掉末尾的逗号
                          const scores = cleanRecord.split(',').map(s => parseInt(s.trim()));
                          const passCount = scores.filter(s => s > 0).length;
                          const totalCount = scores.length;
                          const passRate = Math.round((passCount / totalCount) * 100);
                          return `通过率: ${passCount}/${totalCount} (${passRate}%)`;
                        })()}
                      </Typography>
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

          <TextField
            margin="dense"
            label="分值"
            type="number"
            fullWidth
            variant="outlined"
            value={newTestCase.score}
            onChange={(e) => setNewTestCase({ ...newTestCase, score: Number(e.target.value) })}
            inputProps={{ min: 1, step: 1 }}
            helperText="该测试样例的分值"
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
      
      {/* 消息弹窗 */}
      <MessageComponent />
    </Box>
  );
}
