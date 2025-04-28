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
  }
});

export interface Lecture {
  id: string;
  title: string;
  status?: 'notStarted' | 'inProgress' | 'done';  // 可选: 添加状态属性
}

export interface Course {
  id: string;
  title: string;
  lectures: Lecture[];
}
