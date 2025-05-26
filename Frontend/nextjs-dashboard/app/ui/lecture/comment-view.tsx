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
import {CommentAPI, CourseAPI} from "@/app/lib/client-api";
import { useStore } from "@/store/useStore";
import { Comment } from "@/app/lib/definitions";

const getAvatarColor = (userId: number): string => {
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

  const hash = userId.toString().split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const mockComments: Comment[] = [

];

interface CommentViewProps {
  courseId: number;
  lectureId: number;
}

export default function CommentView({ courseId, lectureId }: CommentViewProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<{ repliedToCommentId: number, repliedToUserName: string } | null>(null);
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function loadComments() {
      try {
        const comments = await CommentAPI.fetchComments(lectureId);
        console.log('Fetched comments in comment-view:', comments);
        setComments(comments || []);
      } catch (err) {
        console.error('拉取课程失败', err);
      }
    }
    loadComments();
  }, [lectureId]);

  const userInfo = useStore(state => state.userInfo);
  const currentUserId = userInfo?.userId ?? null;

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

  const handleToggleReplies = (commentId: number) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const handleReply = (repliedToCommentId: number, repliedToUserName: string) => {
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
        lectureId: lectureId,
        content: newComment,
        authorId: userInfo?.userId ? userInfo.userId : null,
        createTime: new Date().toISOString(),
        repliedToCommentId: replyTo ? replyTo.repliedToCommentId : null,
      };

      await CommentAPI.publishComment(newCommentData);

      const comments = await CommentAPI.fetchComments(lectureId);

      setComments(comments || []);
      setNewComment("");
      setReplyTo(null);
      setDialogOpen(false);
    } catch (error) {
      console.error("发布评论失败:", error);
    }
  };

  const handleDeleteComment = async (commentId: number, authorId: number) => {

    if (authorId !== currentUserId) {
      console.error("无法删除他人发布的评论");
      return;
    }

    try {
      const success = CommentAPI.deleteComment(commentId, currentUserId);

      if (!success) {
        throw new Error("后端 reported 删除失败");
      }

      const comments = await CommentAPI.fetchComments(lectureId);

      setComments(comments || []);
    } catch (error) {
      console.error("删除评论失败:", error);
    }
  };

  const handleLike = async (comment : Comment) => {
    const payload = {
      userId: userInfo?.userId? userInfo.userId : 0,
      commentId: comment.id,
      likes: comment.likes + 1
    }
    CommentAPI.likeComment(payload)

    const comments = await CommentAPI.fetchComments(lectureId);

    setComments(comments || []);
  };

  const getReplies = (commentId: number): Comment[] => {
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
                      onClick={() => handleLike(comment)}
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
                                  onClick={() => handleLike(comment)}
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
