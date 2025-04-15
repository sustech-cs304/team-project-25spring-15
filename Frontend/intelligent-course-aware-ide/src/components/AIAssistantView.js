// AIAssistantView.js
import React, { useState, useRef, useEffect } from 'react';
import {
    Box, Typography, TextField, Button, Paper, Avatar, Divider,
    CircularProgress, IconButton, Tabs, Tab, Card
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import QuizIcon from '@mui/icons-material/Quiz';
import { motion } from 'framer-motion';
import axios from 'axios';

// 聊天容器样式
const ChatContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 200px)',
    width: '100%',
    overflow: 'hidden',
}));

// 消息列表样式
const MessageList = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    overflowY: 'auto',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
}));

// 输入区域样式
const InputArea = styled(Paper)(({ theme }) => ({
    display: 'flex',
    padding: theme.spacing(1, 2),
    alignItems: 'center',
    borderTop: `1px solid ${theme.palette.divider}`,
}));

// 消息气泡样式
const MessageBubble = styled(Paper)(({ theme, isUser }) => ({
    padding: theme.spacing(1.5, 2),
    borderRadius: 12,
    maxWidth: '80%',
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    backgroundColor: isUser ? theme.palette.primary.main : theme.palette.grey[100],
    color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
}));

// 思维导图容器样式
const MindmapContainer = styled(Box)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    backgroundColor: '#f9f9f9',
    minHeight: 200,
}));

// 测验卡片样式
const QuizCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
}));

// 测验选项样式
const QuizOption = styled(Button)(({ theme, selected }) => ({
    justifyContent: 'flex-start',
    textAlign: 'left',
    marginTop: theme.spacing(1),
    backgroundColor: selected ? theme.palette.action.selected : 'transparent',
    '&:hover': {
        backgroundColor: selected
            ? theme.palette.action.selected
            : theme.palette.action.hover,
    },
}));

// 选项结果图标容器
const ResultIconContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
}));

const AIAssistantView = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: '你好！我是你的 AI 学习助手。我可以帮你解答问题、生成思维导图或创建小测验。请告诉我你需要什么帮助？', isUser: false, type: 'text' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeMode, setActiveMode] = useState(0); // 0: 聊天, 1: 思维导图, 2: 小测验
    const [quiz, setQuiz] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const messageListRef = useRef(null);

    // 自动滚动到最新消息
    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    // 处理消息发送
    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputValue,
            isUser: true,
            type: 'text',
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            // 模拟 API 调用
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 根据当前模式生成不同的回复
            let aiResponse;

            if (activeMode === 0) { // 聊天模式
                aiResponse = {
                    id: Date.now() + 1,
                    text: generateAIResponse(inputValue),
                    isUser: false,
                    type: 'text',
                };
            } else if (activeMode === 1) { // 思维导图模式
                aiResponse = {
                    id: Date.now() + 1,
                    text: '我已为你生成思维导图：',
                    isUser: false,
                    type: 'mindmap',
                    mindmapData: generateMindmap(inputValue),
                };
            } else if (activeMode === 2) { // 小测验模式
                const generatedQuiz = generateQuiz(inputValue);
                setQuiz(generatedQuiz);

                aiResponse = {
                    id: Date.now() + 1,
                    text: '我已为你创建一个小测验：',
                    isUser: false,
                    type: 'quiz',
                };
            }

            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error('发送消息出错:', error);
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: '抱歉，处理您的请求时出错了。请稍后再试。',
                    isUser: false,
                    type: 'text',
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // 处理键盘按键
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // 切换模式
    const handleModeChange = (event, newMode) => {
        setActiveMode(newMode);

        // 添加模式切换提示
        const modeMessages = [
            '切换到聊天模式。有什么问题我可以帮你解答？',
            '切换到思维导图模式。请告诉我你想要生成思维导图的主题。',
            '切换到小测验模式。请告诉我你想测试的知识领域，我会为你生成一个小测验。',
        ];

        setMessages(prev => [
            ...prev,
            {
                id: Date.now(),
                text: modeMessages[newMode],
                isUser: false,
                type: 'text',
            }
        ]);

        // 重置测验状态
        setQuiz(null);
        setSelectedOptions({});
        setQuizSubmitted(false);
    };

    // 选择测验选项
    const handleSelectOption = (questionId, optionIndex) => {
        if (quizSubmitted) return;

        setSelectedOptions(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    // 提交测验
    const handleSubmitQuiz = () => {
        if (!quiz || quizSubmitted) return;

        let correctCount = 0;

        // 计算得分
        quiz.questions.forEach((question, index) => {
            if (selectedOptions[index] === question.correctIndex) {
                correctCount++;
            }
        });

        const finalScore = Math.round((correctCount / quiz.questions.length) * 100);
        setScore(finalScore);
        setQuizSubmitted(true);

        // 添加评分消息
        setMessages(prev => [
            ...prev,
            {
                id: Date.now(),
                text: `测验已完成！你的得分是: ${finalScore}分`,
                isUser: false,
                type: 'text',
            }
        ]);
    };

    // 模拟 AI 回复生成
    const generateAIResponse = (question) => {
        const responses = [
            `针对"${question}"，我建议你可以从以下几个方面思考：首先，理解基本概念；其次，学习实际应用；最后，通过例题巩固。`,
            `关于"${question}"，这是一个很好的问题。在学习编程时，理解数据结构和算法的基础非常重要。`,
            `"${question}"是很多学生容易困惑的地方。关键在于掌握核心原理，然后通过大量练习来加深理解。`,
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    };

    // 模拟思维导图生成
    const generateMindmap = (topic) => {
        // 简单模拟思维导图数据
        return {
            topic: topic,
            main: [
                { name: '核心概念', children: ['定义', '特性', '应用场景'] },
                { name: '学习路径', children: ['基础知识', '进阶技巧', '实战项目'] },
                { name: '常见问题', children: ['问题1', '问题2', '解决方案'] },
            ]
        };
    };

    // 模拟测验生成
    const generateQuiz = (topic) => {
        return {
            title: `关于"${topic}"的小测验`,
            questions: [
                {
                    id: 0,
                    question: '以下哪个选项是正确的描述？',
                    options: [
                        'A. 选项1的描述',
                        'B. 选项2的描述',
                        'C. 选项3的描述',
                        'D. 选项4的描述',
                    ],
                    correctIndex: 2,
                },
                {
                    id: 1,
                    question: '下面哪个说法是错误的？',
                    options: [
                        'A. 说法1',
                        'B. 说法2',
                        'C. 说法3',
                        'D. 说法4',
                    ],
                    correctIndex: 1,
                },
                {
                    id: 2,
                    question: '以下代码的输出结果是什么？\n`console.log(1 + "2")`',
                    options: [
                        'A. 3',
                        'B. "12"',
                        'C. "3"',
                        'D. 12',
                    ],
                    correctIndex: 1,
                },
            ],
        };
    };

    // 渲染思维导图
    const renderMindmap = (data) => {
        return (
            <MindmapContainer>
                <Typography variant="h6" gutterBottom>{data.topic}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {data.main.map((branch, index) => (
                        <Box key={index} sx={{ ml: 2 }}>
                            <Typography variant="subtitle1" color="primary">• {branch.name}</Typography>
                            <Box sx={{ ml: 4 }}>
                                {branch.children.map((leaf, i) => (
                                    <Typography key={i} variant="body2">- {leaf}</Typography>
                                ))}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </MindmapContainer>
        );
    };

    // 渲染测验
    const renderQuiz = () => {
        if (!quiz) return null;

        return (
            <QuizCard elevation={3}>
                <Typography variant="h6" gutterBottom>{quiz.title}</Typography>
                <Divider sx={{ my: 2 }} />

                {quiz.questions.map((question, qIndex) => (
                    <Box key={qIndex} sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            {qIndex + 1}. {question.question}
                        </Typography>

                        <Box sx={{ ml: 2 }}>
                            {question.options.map((option, oIndex) => {
                                const isSelected = selectedOptions[qIndex] === oIndex;
                                const isCorrect = quizSubmitted && oIndex === question.correctIndex;
                                const isWrong = quizSubmitted && isSelected && oIndex !== question.correctIndex;

                                return (
                                    <QuizOption
                                        key={oIndex}
                                        fullWidth
                                        variant="text"
                                        selected={isSelected}
                                        onClick={() => handleSelectOption(qIndex, oIndex)}
                                        sx={{
                                            border: quizSubmitted && isCorrect ? '1px solid green' : undefined,
                                            bgcolor: quizSubmitted && isWrong ? '#ffebee' : undefined,
                                        }}
                                    >
                                        <Typography variant="body2">{option}</Typography>

                                        {quizSubmitted && (isCorrect || isWrong) && (
                                            <ResultIconContainer>
                                                {isCorrect && <Box color="green">✓</Box>}
                                                {isWrong && <Box color="error.main">✗</Box>}
                                            </ResultIconContainer>
                                        )}
                                    </QuizOption>
                                );
                            })}
                        </Box>
                    </Box>
                ))}

                {!quizSubmitted && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(selectedOptions).length < quiz.questions.length}
                        sx={{ mt: 2 }}
                    >
                        提交答案
                    </Button>
                )}

                {quizSubmitted && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                        <Typography variant="h6">
                            得分: {score}分
                        </Typography>
                        <Typography variant="body2">
                            {score >= 80 ? '很棒！你掌握得很好！' :
                                score >= 60 ? '不错的表现，继续努力！' :
                                    '再接再厉，多加练习！'}
                        </Typography>
                    </Box>
                )}
            </QuizCard>
        );
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs
                    value={activeMode}
                    onChange={handleModeChange}
                    variant="fullWidth"
                >
                    <Tab icon={<SmartToyIcon />} label="AI对话" />
                    <Tab icon={<AccountTreeIcon />} label="思维导图" />
                    <Tab icon={<QuizIcon />} label="小测验" />
                </Tabs>
            </Box>

            <ChatContainer>
                <MessageList ref={messageListRef}>
                    {messages.map((msg) => (
                        <Box
                            key={msg.id}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: msg.isUser ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                {!msg.isUser && (
                                    <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>
                                        <SmartToyIcon />
                                    </Avatar>
                                )}
                                <Typography variant="caption" color="text.secondary">
                                    {msg.isUser ? '你' : 'AI助手'}
                                </Typography>
                                {msg.isUser && (
                                    <Avatar sx={{ ml: 1, bgcolor: 'secondary.main' }}>
                                        <PersonIcon />
                                    </Avatar>
                                )}
                            </Box>

                            <MessageBubble isUser={msg.isUser} elevation={1}>
                                <Typography variant="body2">{msg.text}</Typography>

                                {msg.type === 'mindmap' && msg.mindmapData && renderMindmap(msg.mindmapData)}
                                {msg.type === 'quiz' && activeMode === 2 && renderQuiz()}
                            </MessageBubble>
                        </Box>
                    ))}

                    {isLoading && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>
                                <SmartToyIcon />
                            </Avatar>
                            <CircularProgress size={20} />
                        </Box>
                    )}
                </MessageList>

                <InputArea>
                    <TextField
                        fullWidth
                        variant="standard"
                        placeholder={activeMode === 0
                            ? "输入你的问题..."
                            : activeMode === 1
                                ? "输入思维导图主题..."
                                : "输入你想测试的知识领域..."}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        InputProps={{ disableUnderline: true }}
                    />
                    <IconButton
                        color="primary"
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                    >
                        <SendIcon />
                    </IconButton>
                </InputArea>
            </ChatContainer>
        </Box>
    );
};

export default AIAssistantView;