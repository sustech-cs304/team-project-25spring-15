'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { CourseAPI } from '@/app/lib/client-api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    courseName: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // 检查表单数据是否完整
      if (!formData.courseName.trim()) {
        throw new Error('课程名称不能为空');
      }
      
      // 调用API创建课程
      await CourseAPI.addCourse({
        courseName: formData.courseName,
        description: formData.description,
      });
      
      setSuccess(true);
      
      // 创建成功后返回课程列表
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('创建课程失败:', err);
      setError(err instanceof Error ? err.message : '创建课程失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/dashboard')}
          sx={{ mr: 2 }}
        >
          返回
        </Button>
        <Typography variant="h4" component="h1">
          创建新课程
        </Typography>
      </Box>
      
      {success && (
        <Alert severity="success" sx={{ mb: 4 }}>
          课程创建成功！正在返回课程列表...
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="课程名称"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            margin="normal"
            required
            variant="outlined"
            disabled={loading}
          />
          
          <TextField
            fullWidth
            label="课程描述"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
            disabled={loading}
          />
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => router.push('/dashboard')}
              sx={{ mr: 2 }}
              disabled={loading}
            >
              取消
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              disabled={loading}
            >
              {loading ? '保存中...' : '保存'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
} 