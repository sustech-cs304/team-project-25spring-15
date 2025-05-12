import { deepseek } from "@ai-sdk/deepseek";
import { customProvider, extractReasoningMiddleware, wrapLanguageModel } from "ai";

export const DEFAULT_CHAT_MODEL: string = 'chat-model';

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

export interface UserInfo {
  userId: number;
  username: string;
  email: string;
  token: string;
}

export interface Exercise {
  exerciseId: number;
  publisherId: number;
  title: string;
  description: string;
  deadLine: string;
  score: number;
}

export interface Lecture {
  lectureId: number;
  lectureName: string;
  description?: string;
  status?: 'notStarted' | 'inProgress' | 'done';  // 可选: 添加状态属性
  courseId?: number; // 添加课程ID引用
}

export interface Course {
  courseId: number;
  courseName: string;
  description?: string;
  endTime: string;
  startTime: string;
  teacherId: number;
  lectures: Lecture[];
}

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};
