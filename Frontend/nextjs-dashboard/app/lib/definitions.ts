import { deepseek } from "@ai-sdk/deepseek";
import { customProvider, extractReasoningMiddleware, wrapLanguageModel } from "ai";

export const DEFAULT_CHAT_MODEL: string = 'chat-model';

export type CmdResult = {
  output: string;
  error: string;
};

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'Chat model',
    description: 'Primary model for all-purpose chat',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Reasoning model',
    description: 'Uses advanced reasoning',
  },
];

export const myProvider = customProvider({
  languageModels: {
    'chat-model': deepseek('deepseek-chat'),
    'chat-model-reasoning': wrapLanguageModel({
      model: deepseek('deepseek-reasoner'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    'artifact-model': deepseek('deepseek-chat'),
  }
});

export type AiMessage = {
  chatId: string; // uuid
  lectureId: number;
  userId: number;
  role: string;
  parts: string;
  createdAt: string;
};

export interface Lecture {
  lectureId: number;
  lectureName: string;
  description?: string;
  status?: 'notStarted' | 'inProgress' | 'done';  // 可选: 添加状态属性
  courseId: number; // 添加课程ID引用
}

export interface Course {
  courseId: number;
  courseName: string;
  description?: string;
  endTime: string;
  startTime: string;
  teacherId: number;
  chatId: number;
  lectures: Lecture[];
}

export type UserInfo = {
  userId: number;
  userName: string;
  usersign?: string;
  university?: string;
  birthday?: string;
  identity?: string;
  email: string;
};

export type LoginResponse = {
  data: {
    token: string;
    userInfo: UserInfo;
  };
};

export interface Exercise {
  exerciseId: number;
  publisherId: number;
  title: string;
  description: string;
  deadLine: string;
  score: number;
}

export interface Comment {
  id: number;
  lectureId: number;
  content: string;
  authorId: number;
  authorName: string;
  createTime: string;
  likes: number;
  repliedToCommentId: number | null;
  repliedToUserId?: number;
  repliedToUserName?: string;
}

export interface Assignment {
  assignmentId: number;
  publisherId: number;
  assignmentName: string;
  description: string;
  deadline: string;
  score: number; // 学生获得的分数
  totalScore?: number; // 作业的总分值
  courseId: number;
  lectureId: number;
}


