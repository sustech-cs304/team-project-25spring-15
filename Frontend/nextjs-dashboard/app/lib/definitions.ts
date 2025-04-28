export const DEFAULT_CHAT_MODEL: string = 'deepseek-chat';

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'deepseek-chat',
    name: 'Chat model',
    description: 'Primary model for all-purpose chat',
  },
  {
    id: 'deepseek-reasoner',
    name: 'Reasoning model',
    description: 'Uses advanced reasoning',
  },
];

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
