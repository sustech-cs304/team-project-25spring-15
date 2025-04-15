// CommentView.js
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    Avatar,
    Grid,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent, TextField, DialogActions
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import axios from "axios";

// 顶部容器：用于标题和发布按钮
const Container = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));

// 上传按钮样式
const UploadButton = styled(Button)(({ theme }) => ({
    textAlign: 'center',
    borderRadius: 25,
    padding: '10px 20px',
    cursor: 'pointer',
    marginTop: theme.spacing(2),
    fontSize: '16px',
    color: '#ffffff',
}));

// 评论列表容器
const CommentsContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    height: 'calc(100vh - 200px)', // 调整高度以适应你的布局
    overflowY: 'auto', // 添加垂直滚动
    padding: theme.spacing(1),
}));

// 评论卡片
const CommentCard = styled(Box)(({ theme }) => ({
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: theme.shadows[1],
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: '100%',
}));

// 评论头部区域样式
const CommentHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
}));

// 评论信息容器
const CommentInfo = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
}));

// 用户名样式
const CommentName = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
}));

// 评论时间样式
const CommentDate = styled(Typography)(({ theme }) => ({
    fontSize: '0.8em',
    color: '#a2a9b4',
    fontWeight: 'bold',
}));

// 评论内容样式
const CommentContent = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    color: '#7f8692',
    textAlign: 'left',
    lineHeight: 1.5,
    marginTop: theme.spacing(2),
    width: '100%',
}));

const CommentView = ({ status = '评论' }) => {
    const [publishCommentDialogVisible, setPublishCommentDialogVisible] = useState(false);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // 获取评论数据（从后端获取，如果失败则使用模拟数据）
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get('http://your-backend-api/getComments');
                if (response.data && Array.isArray(response.data.comments)) {
                    setComments(response.data.comments);
                } else {
                    throw new Error('数据格式不正确');
                }
            } catch (error) {
                console.error('获取评论失败，使用模拟数据：', error);
                // 模拟的评论数据
                const simulatedComments = [
                    {
                        commentID: 'cmt-001',
                        user: { userName: 'Alice' },
                        commentTime: '2025-04-10 10:00',
                        content: '我觉得这部分解释得很清楚！'
                    },
                    {
                        commentID: 'cmt-002',
                        user: { userName: 'Bob' },
                        commentTime: '2025-04-10 11:00',
                        content: '我有点不理解第二个公式，能再详细说明一下吗？'
                    },
                    {
                        commentID: 'cmt-003',
                        user: { userName: 'Charlie' },
                        commentTime: '2025-04-10 11:30',
                        content: '不错的讲解，希望能看到更多示例。'
                    }
                ];
                setComments(simulatedComments);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, []);

    // 处理评论提交
    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            // 获取当前日期和时间
            const now = new Date();
            const formattedDate = now.toISOString().split('T')[0] + ' ' +
                now.toTimeString().split(' ')[0].substring(0, 5);

            const newCommentObj = {
                commentID: `cmt-${Date.now()}`,
                user: { userName: '当前用户' },
                commentTime: formattedDate,
                content: newComment,
            };

            // 发送到后端 (实际应用中)
            // const response = await axios.post('http://your-backend-api/comments', newCommentObj);

            setComments([...comments, newCommentObj]);
            setNewComment('');
            setPublishCommentDialogVisible(false);
        } catch (error) {
            console.error('发表评论失败:', error);
        } finally {
            setSubmitting(false);
        }
    };

    // 根据 status 返回标题文本
    const getText1 = (status) => {
        return status === '评论' ? '讨论区' : '';
    };

    // 根据 status 返回上传按钮文本
    const getUploadButtonText = (status) => {
        return status === '评论' ? '发布评论' : '';
    };

    // 如果 status 不是 '评论'，不渲染该组件
    if (status !== '评论') {
        return null;
    }

    return (
        <Box>
            {/* 顶部标题和发布按钮 */}
            <Container>
                <Typography variant="h3">{getText1(status)}</Typography>
                <UploadButton variant="contained" color="primary" onClick={() => setPublishCommentDialogVisible(true)}>
                    {getUploadButtonText(status)}
                </UploadButton>
            </Container>

            {/* 显示加载提示 */}
            {loading && <Box sx={{ textAlign: 'center' }}><CircularProgress /></Box>}

            {/* 评论列表 */}
            {!loading && (
                <CommentsContainer>
                    {comments.map((comment) => (
                        <CommentCard key={comment.commentID}>
                            <CommentHeader>
                                <Avatar sx={{ marginRight: 2 }} />
                                <CommentInfo>
                                    <CommentName>{comment.user.userName}</CommentName>
                                    <CommentDate>{comment.commentTime}</CommentDate>
                                </CommentInfo>
                            </CommentHeader>
                            <CommentContent>{comment.content}</CommentContent>
                        </CommentCard>
                    ))}
                </CommentsContainer>
            )}

            {/* 发表评论对话框 */}
            <Dialog
                open={publishCommentDialogVisible}
                onClose={() => setPublishCommentDialogVisible(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>发表评论</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="评论内容"
                        fullWidth
                        multiline
                        rows={4}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPublishCommentDialogVisible(false)} color="primary">
                        取消
                    </Button>
                    <Button
                        onClick={handleSubmitComment}
                        color="primary"
                        variant="contained"
                        disabled={!newComment.trim() || submitting}
                    >
                        {submitting ? '提交中...' : '提交'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CommentView;
