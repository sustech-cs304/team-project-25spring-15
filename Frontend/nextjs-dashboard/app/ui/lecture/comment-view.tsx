'use client';

import {useEffect, useState} from "react";
import {
  Typography,
  Avatar,
  Box,
  Button,
  TextField,
  Divider,
  IconButton,
  Paper,
  Collapse,
  List,
  ListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import SendIcon from "@mui/icons-material/Send";
import { formatDistanceToNow, format, differenceInDays } from "date-fns";
import { zhCN } from "date-fns/locale";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";

interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createTime: string;
  likes: number;
  repliedToCommentId: string | null;
  repliedToUserId?: string;
  repliedToUserName?: string;
}

const getAvatarColor = (userId: string): string => {
  const colors = [
    '#1976d2',
    '#388e3c',
    '#d32f2f',
    '#7b1fa2',
    '#f57c00',
    '#0288d1',
    '#512da8',
    '#c2185b',
    '#00796b',
    '#fbc02d'
  ];

  const hash = userId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const currentUserId = "currentUser";

const mockComments: Comment[] = [

];

export default function CommentView() {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<{ repliedToCommentId: string, repliedToUserName: string } | null>(null);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  // 获取评论的函数
  const fetchComments = async (lectureId: string) => {
    try {
      const response = await axios.get(`https://m1.apifoxmock.com/m2/5989566-5677982-default/291721414`);
      console.log("获取评论成功:", response.data);
      setComments(response.data); // 将获取到的评论数据设置到状态中
    } catch (error) {
      console.error("获取评论失败:", error);
    }
  };

  // 在组件加载时调用 fetchComments
  useEffect(() => {
    fetchComments("lectureId"); // 替换为实际的 lectureId
  }, ["lectureId"]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const daysDifference = differenceInDays(now, date);

    if (daysDifference < 7) {
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: zhCN
      });
    } else {
      return format(date, 'yyyy年MM月dd日 HH:mm:ss', { locale: zhCN });
    }
  };

  const handleToggleReplies = (commentId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const handleReply = (repliedToCommentId: string, repliedToUserName: string) => {
    setReplyTo({ repliedToCommentId: repliedToCommentId, repliedToUserName: repliedToUserName });
    setDialogOpen(true);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setDialogOpen(false);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      const newCommentData = {
        content: newComment,
        authorId: "currentUser", // 替换为实际的用户 ID
        createTime: new Date().toISOString(),
        repliedToCommentId: replyTo ? replyTo.repliedToCommentId : null,
      };

      await axios.post(`https://m1.apifoxmock.com/m2/5989566-5677982-default/291721414`, newCommentData);

      await fetchComments("lectureId");

      setNewComment("");
      setReplyTo(null);
      setDialogOpen(false);
    } catch (error) {
      console.error("发布评论失败:", error);
    }
  };

  const handleDeleteComment = async (commentId: string, authorId: string) => {
    const currentUserId = "currentUser"; // 替换为实际的当前用户 ID

    if (authorId !== currentUserId) {
      console.error("无法删除他人发布的评论");
      return;
    }

    try {
      await axios.delete(`https://m1.apifoxmock.com/m2/5989566-5677982-default/291721414/${commentId}`);

      await fetchComments("lectureId");
    } catch (error) {
      console.error("删除评论失败:", error);
    }
  };

  const handleLike = (commentId: string) => {
    setComments(comments.map(comment =>
      comment.id === commentId
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  const getReplies = (commentId: string): Comment[] => {
    const directReplies = comments
      .filter(comment => comment.repliedToCommentId === commentId)
      .sort((a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime());
    return directReplies.reduce((allReplies, reply) => {
      return [...allReplies, reply, ...getReplies(reply.id)];
    }, [] as Comment[]);
  };

  const topLevelComments = comments
    .filter(comment => !comment.repliedToCommentId)
    .sort((a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime());

  return (
    <main className="p-4">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" component="h1">
          课程评论区
        </Typography>
        <Button
          variant="contained"
          onClick={() => setDialogOpen(true)}
        >
          发布评论
        </Button>
      </Box>

      <Dialog open={dialogOpen} onClose={handleCancelReply}>
        <DialogTitle>{replyTo ? `回复 ${replyTo.repliedToUserName}` : "发布评论"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder={replyTo ? `回复 ${replyTo.repliedToUserName}...` : "写下你的评论..."}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelReply}>取消</Button>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
          >
            发布
          </Button>
        </DialogActions>
      </Dialog>

      <Box>
        {topLevelComments.map((comment) => {
          const replies = getReplies(comment.id);
          const hasReplies = replies.length > 0;
          const isExpanded = expandedComments[comment.id] || false;
          const avatarColor = getAvatarColor(comment.authorId);

          return (
            <Paper key={comment.id} elevation={0} className="mb-4 p-4 border">
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Avatar sx={{ mr: 2, bgcolor: avatarColor }}>
                  {comment.authorName.charAt(0)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>
                      {comment.authorName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(comment.createTime)}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {comment.content}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                      size="small"
                      startIcon={<ReplyIcon />}
                      onClick={() => handleReply(comment.id, comment.authorName)}
                      sx={{ mr: 2 }}
                    >
                      回复
                    </Button>
                    <Button
                      size="small"
                      startIcon={<ThumbUpIcon />}
                      onClick={() => handleLike(comment.id)}
                    >
                      赞 ({comment.likes})
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteComment(comment.id, comment.authorId)}
                      sx={{ display: comment.authorId === currentUserId ? "inline-flex" : "none" }}
                    >
                      删除
                    </Button>

                    {hasReplies && (
                      <Button
                        size="small"
                        onClick={() => handleToggleReplies(comment.id)}
                        endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        sx={{ ml: 'auto' }}
                      >
                        {isExpanded ? '收起回复' : `查看${replies.length}条回复`}
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>

              {hasReplies && (
                <Collapse in={isExpanded}>
                  <List sx={{ pl: 7, mt: 1, mb: 0 }}>
                    {replies.map(reply => {
                      const replyAvatarColor = getAvatarColor(reply.authorId);

                      return (
                        <ListItem key={reply.id} sx={{ display: 'block', px: 0, py: 1.5 }}>
                          <Box sx={{ display: 'flex' }}>
                            <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: replyAvatarColor }}>
                              {reply.authorName.charAt(0)}
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mr: 1 }}>
                                  {reply.authorName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatDate(reply.createTime)}
                                </Typography>
                              </Box>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                {reply.repliedToUserName && (
                                  <Box component="span" sx={{ color: 'primary.main', mr: 0.5 }}>
                                    回复 @{reply.repliedToUserName}
                                  </Box>
                                )}
                                {reply.content}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Button
                                  size="small"
                                  startIcon={<ReplyIcon />}
                                  onClick={() => handleReply(reply.id, reply.authorName)}
                                  sx={{ mr: 2 }}
                                >
                                  回复
                                </Button>
                                <Button
                                  size="small"
                                  startIcon={<ThumbUpIcon />}
                                  onClick={() => handleLike(reply.id)}
                                >
                                  赞 ({reply.likes})
                                </Button>
                                <Button
                                  size="small"
                                  color="error"
                                  startIcon={<DeleteIcon />}
                                  onClick={() => handleDeleteComment(comment.id, comment.authorId)}
                                  sx={{ display: comment.authorId === currentUserId ? "inline-flex" : "none" }}
                                >
                                  删除
                                </Button>
                              </Box>
                            </Box>
                          </Box>
                          {replies.indexOf(reply) < replies.length - 1 && (
                            <Divider sx={{ my: 1.5 }} />
                          )}
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </Paper>
          );
        })}
      </Box>
    </main>
  );
}
