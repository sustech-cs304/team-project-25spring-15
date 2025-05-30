# 智能课程感知IDE - 开发者文档

开发者团队：孙杨洋，林易成，朱育辰，梁煜，朱柯奇



## （一）目录
1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [项目架构](#项目架构)
4. [核心数据模型](#核心数据模型)
5. [API接口文档](#api接口文档)
6. [状态管理](#状态管理)
7. [UI组件库](#ui组件库)
8. [路由结构](#路由结构)
9. [开发指南](#开发指南)
10. [部署说明](#部署说明)



## （二）项目概述

智能课程感知IDE是一个基于`Next.js`的教育平台，支持三种用户身份：学生(`student`)、教师(`teacher`)、超级用户(`superuser`)。平台提供课程管理、讲座内容、练习系统、评论互动、AI助手和协作功能。

### 核心功能
- **课程管理**: 创建、编辑、删除课程，管理学生
- **讲座系统**: 课件上传、笔记编辑、内容展示
- **练习系统**: 代码编辑器、在线运行、测试样例管理
- **评论互动**: 实时评论、回复、点赞功能
- **AI助手**: 智能对话、代码辅助
- **协作功能**: 实时协作编辑、头脑风暴



## （三）技术栈

### 前端框架
- **Next.js 15**: React全栈框架，支持SSR/SSG
- **React 19**: 用户界面库
- **TypeScript**: 类型安全的JavaScript

### UI组件库
- **Material-UI (MUI)**: 主要UI组件库
- **Tailwind CSS**: 原子化CSS框架
- **Heroicons**: 图标库

### 状态管理
- **Zustand**: 轻量级状态管理库
- **SWR**: 数据获取和缓存

### 代码编辑器
- **CodeMirror**: 代码编辑器核心
- **Sandpack**: 在线代码运行环境

### 实时协作
- **Yjs**: 实时协作数据结构
- **Tiptap**: 富文本编辑器
- **Hocuspocus**: 协作服务器

### 其他核心库
- **Axios**: HTTP客户端
- **NextAuth.js**: 身份认证
- **React Markdown**: Markdown渲染
- **Framer Motion**: 动画库



## （四）项目架构

```
nextjs-dashboard/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   ├── dashboard/         # 主要页面
│   ├── lib/              # 核心库文件
│   ├── login/            # 登录页面
│   └── ui/               # UI组件
├── store/                # 状态管理
├── public/               # 静态资源
└── db/                   # 数据库相关
```

### 核心目录说明

#### `/app/lib/`
- `definitions.ts`: 核心数据类型定义
- `client-api.ts`: 客户端API接口
- `server-api.ts`: 服务端API接口
- `utils.ts`: 工具函数
- `prompts.ts`: AI提示词模板

#### `/app/ui/`
- `course/`: 课程相关组件
- `lecture/`: 讲座相关组件
- `dashboard/`: 仪表板组件
- `collab/`: 协作功能组件

#### `/store/`
- `useStore.ts`: Zustand状态管理配置



## （五）核心数据模型

### 用户信息 (UserInfo)
```typescript
export type UserInfo = {
  userId: number;
  userName: string;
  usersign?: string;
  university?: string;
  birthday?: string;
  identity?: string;  // 'student' | 'teacher' | 'superuser'
  email: string;
};
```

### 课程 (Course)
```typescript
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
```

### 讲座 (Lecture)
```typescript
export interface Lecture {
  lectureId: number;
  lectureName: string;
  description?: string;
  status?: 'notStarted' | 'inProgress' | 'done';
  courseId: number;
}
```

### 作业 (Assignment)
```typescript
export interface Assignment {
  assignmentId: number;
  publisherId: number;
  assignmentName: string;
  description: string;
  deadline: string;
  score: number;
  courseId: number;
  lectureId: number;
}
```

### 评论 (Comment)
```typescript
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
```



## （六）API接口文档

### 1. 认证相关

#### 获取认证头
```typescript
export async function getAuthHeader(): Promise<{Authorization?: string}>
```
- **功能**: 获取当前用户的认证头信息
- **返回**: 包含Bearer token的认证头对象

### 2. 课程API (CourseAPI)

#### 获取课程列表
```typescript
async fetchCourses(): Promise<Course[]>
```
- **端点**: `GET /api/course/searchCourseWithLectures/byStudentId`
- **功能**: 获取当前用户的课程列表（包含讲座信息）
- **返回**: 课程数组

#### 添加课程
```typescript
async addCourse(course: {
  courseName: string;
  description: string;
  startTime?: string;
  endTime?: string;
}): Promise<void>
```
- **端点**: `POST /api/course/createCourse`
- **功能**: 创建新课程
- **权限**: 仅教师可用

#### 删除课程
```typescript
async deleteCourse(courseId: number): Promise<any>
```
- **端点**: `DELETE /api/course/deleteCourse`
- **参数**: `CourseId` (query parameter)
- **权限**: 仅课程创建者可用

#### 更新课程
```typescript
async updateCourse(courseId: number, updatedCourse: {
  courseName: string;
  description: string;
}): Promise<void>
```
- **端点**: `PUT /api/course/updateCourse`
- **权限**: 仅课程创建者可用

#### 获取课程学生列表
```typescript
async getCourseStudents(courseId: number): Promise<UserInfo[]>
```
- **端点**: `GET /api/course/getAllStudentsOfACourse/{courseId}`
- **权限**: 仅教师可用

#### 添加学生到课程
```typescript
async addStudentToCourse(courseId: number, email: string): Promise<any>
```
- **端点**: `POST /api/course/addStudents`
- **请求体**: `{ courseId: number, studentsEmail: string[] }`
- **权限**: 仅教师可用

#### 从课程移除学生
```typescript
async removeStudentFromCourse(courseId: number, studentId: number): Promise<any>
```
- **端点**: `DELETE /api/course/removeStudent`
- **参数**: `courseId`, `studentId` (query parameters)
- **权限**: 仅教师可用

### 3. 讲座API (LectureAPI)

#### 获取课程讲座列表
```typescript
async fetchLecturesByCourse(courseId: number): Promise<Lecture[]>
```
- **端点**: `GET /api/lecture/getLectures/{courseId}`
- **功能**: 获取指定课程的所有讲座

#### 添加讲座
```typescript
async addLecture(courseId: number, payload: {
  lectureName: string;
  description: string;
}): Promise<void>
```
- **端点**: `POST /api/lecture/createLecture`
- **权限**: 仅教师可用

#### 删除讲座
```typescript
async deleteLecture(courseId: number, lectureId: number): Promise<void>
```
- **端点**: `DELETE /api/lecture/deleteLecture`
- **参数**: `CourseId`, `LectureId` (query parameters)
- **权限**: 仅教师可用

#### 更新讲座
```typescript
async updateLecture(chatId: number, courseId: number, lectureId: number, updatedLecture: {
  lectureName: string;
  description: string;
}): Promise<void>
```
- **端点**: `PUT /api/lecture/updateLecture`
- **权限**: 仅教师可用

### 4. 作业API (AssignmentAPI)

#### 获取讲座作业列表
```typescript
async fetchAssignments(lectureId: number): Promise<Assignment[]>
```
- **端点**: `GET /api/assignment/getAllAssignmentOfALecture`
- **参数**: `lectureId` (query parameter)

#### 创建作业
```typescript
async createAssignment(assignment: Assignment, courseName: string, chatId: number): Promise<void>
```
- **端点**: `POST /api/assignment/createAssignment`
- **权限**: 仅教师可用

#### 更新作业
```typescript
async updateAssignment(assignment: Assignment, courseName: string, chatId: number): Promise<void>
```
- **端点**: `PUT /api/assignment/updateAssignment`
- **权限**: 仅教师可用

#### 删除作业
```typescript
async deleteAssignment(assignmentId: number, courseId: number): Promise<any>
```
- **端点**: `DELETE /api/assignment/deleteAssignment`
- **参数**: `assignmentId`, `courseId` (query parameters)
- **权限**: 仅教师可用

### 5. 评论API (CommentAPI)

#### 获取讲座评论
```typescript
async fetchComments(lectureId: number): Promise<Comment[]>
```
- **端点**: `GET /api/comment/getComment/{lectureId}`

#### 发布评论
```typescript
async publishComment(newCommentData: {
  lectureId: number | null;
  content: string | null;
  authorId: number | null;
  createTime: string | null;
  repliedToCommentId: number | null;
}): Promise<void>
```
- **端点**: `POST /api/comment/createComment`

#### 删除评论
```typescript
async deleteComment(commentId: number, userId: number): Promise<any>
```
- **端点**: `DELETE /api/comment/deleteComment`
- **参数**: `commentId`, `userId` (query parameters)
- **权限**: 仅评论作者可用

#### 点赞评论
```typescript
async likeComment(payload: {
  userId: number;
  commentId: number;
  likes: number;
}): Promise<void>
```
- **端点**: `PUT /api/comment/updateComment`

### 6. 文件API (FileAPI)

#### 上传文件
```typescript
async uploadFile(file: File, lectureId: number): Promise<{result: string, fileId: string}>
```
- **端点**: `POST /api/Files/lectureFile/upload`
- **请求体**: FormData (multipart/form-data)
- **功能**: 上传课件文件或测试样例

#### 获取文件
```typescript
async getFile(lectureId: number): Promise<Blob>
```
- **端点**: `GET /api/Files/lectureFile/lecture/{lectureId}`
- **返回**: 文件二进制数据

### 7. 代码运行API (CodeAPI)

#### 运行代码
```typescript
async runCode(code_str: string, lang: string): Promise<string>
```
- **端点**: `POST /api/codeRunner/run`
- **请求体**: `{ codeInfo: { code: string }, type: string }`
- **功能**: 在线运行代码并返回结果

### 8. 课件API (CourseWareAPI)

#### 上传PDF课件
```typescript
async uploadPdf(file: File, lectureId: string): Promise<any>
```
- **端点**: `POST /api/Files/lectureFile/upload`

#### 获取PDF课件
```typescript
async getPdf(lectureId: string): Promise<any>
```
- **端点**: `GET /api/Files/lectureFile/lecture/{lectureId}`

#### 上传Markdown笔记
```typescript
async uploadMarkdown(formData: FormData): Promise<any>
```
- **端点**: `POST /api/Files/lectureNote/upload`

#### 获取Markdown笔记
```typescript
async getMarkdown(lectureId: string): Promise<any>
```
- **端点**: `GET /api/Files/lectureNote/lecture/{lectureId}`



## （七）状态管理

### Zustand Store结构

```typescript
interface Store {
  // 认证状态
  token: string;
  setToken: (token: string) => void;
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo | null) => void;
  isLoggedIn: boolean;
  setLoggedIn: (status: boolean) => void;
  
  // 课程数据
  courses: Course[];
  setCourses: (c: Course[]) => void;
  lectures: Lecture[];
  setLectures: (l: Lecture[]) => void;
  
  // 选择状态
  selectedCourseId: number;
  setSelectedCourseId: (id: number) => void;
  selectedLectureId: number;
  setSelectedLectureId: (id: number) => void;
}
```

### 使用示例

```typescript
import { useStore } from '@/store/useStore';

function MyComponent() {
  const userInfo = useStore(state => state.userInfo);
  const courses = useStore(state => state.courses);
  const setCourses = useStore(state => state.setCourses);
  
  // 组件逻辑...
}
```



## （八）UI组件库

### 核心组件

#### CourseList (`app/ui/course/course-list.tsx`)
- **功能**: 显示课程列表，支持"全部课程"和"我的课程"标签切换
- **Props**: 无
- **权限**: 所有用户

#### LectureList (`app/ui/course/lecture-list.tsx`)
- **功能**: 显示课程的讲座列表
- **Props**: `{ courseId: number }`
- **权限**: 课程成员

#### StudentList (`app/ui/course/student-list.tsx`)
- **功能**: 学生管理页面，教师可查看、添加、移除学生
- **Props**: `{ courseId: number }`
- **权限**: 仅教师

#### ExerciseRender (`app/ui/lecture/exercise-render.tsx`)
- **功能**: 练习页面，包含题目描述和代码编辑器
- **Props**: `{ assignment: Assignment }`
- **权限**: 课程成员

### 组件使用示例

```typescript
// 课程列表页面
import CourseList from '@/app/ui/course/course-list';

export default function Dashboard() {
  return <CourseList />;
}

// 讲座列表页面
import LectureList from '@/app/ui/course/lecture-list';

export default function CoursePage({ params }: { params: { courseId: string } }) {
  return <LectureList courseId={parseInt(params.courseId)} />;
}
```



## （九）路由结构

### 主要路由

```
/                           # 首页（重定向到登录或仪表板）
/login                      # 登录页面
/dashboard                  # 课程列表页面
/dashboard/course/[courseId]              # 课程详情页（讲座列表）
/dashboard/course/[courseId]/students     # 学生管理页（仅教师）
/dashboard/[courseId]/[lectureId]         # 讲座功能页面
```

### 动态路由参数

- `[courseId]`: 课程ID
- `[lectureId]`: 讲座ID

### 权限控制

路由级别的权限控制通过组件内部检查用户身份实现：

```typescript
const userInfo = useStore(state => state.userInfo);
const isTeacher = userInfo?.identity === 'teacher';

if (!isTeacher) {
  router.push('/dashboard');
  return null;
}
```



## （十）开发指南

### 1. 环境设置

1. **安装依赖**
```bash
pnpm install
```

2. **启动开发服务器**
```bash
pnpm dev
```

3. **构建生产版本**
```bash
pnpm build
pnpm start
```

### 2. 开发规范

#### 组件开发
- 使用TypeScript进行类型安全开发
- 组件应该有明确的Props接口定义
- 使用Material-UI组件保持UI一致性
- 添加适当的错误处理和加载状态

#### API调用
- 所有API调用都应该通过`client-api.ts`中的封装函数
- 使用`getAuthHeader()`获取认证信息
- 添加适当的错误处理和日志记录

#### 状态管理
- 使用Zustand进行全局状态管理
- 避免在组件间传递过多props
- 持久化重要的用户状态（token、userInfo等）

### 3. 代码示例

#### 创建新的API接口
```typescript
// 在 client-api.ts 中添加新的API
export const NewAPI = {
  fetchData: async (id: number) => {
    const headers = await getAuthHeader();
    try {
      const response = await axios.get(`/api/new-endpoint/${id}`, { headers });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw error;
    }
  }
};
```

#### 创建新的UI组件
```typescript
// 新组件文件
'use client';

import { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useStore } from '@/store/useStore';

interface MyComponentProps {
  id: number;
}

export default function MyComponent({ id }: MyComponentProps) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const userInfo = useStore(state => state.userInfo);

  useEffect(() => {
    // 数据加载逻辑
  }, [id]);

  if (loading) {
    return <Typography>加载中...</Typography>;
  }

  return (
    <Container>
      {/* 组件内容 */}
    </Container>
  );
}
```

### 4. 测试指南

#### 单元测试
- 使用Jest和React Testing Library
- 测试组件的渲染和交互
- 模拟API调用和状态变化

#### 集成测试
- 测试完整的用户流程
- 验证API集成的正确性
- 测试权限控制逻辑

### 5. 性能优化

#### 代码分割
- 使用动态导入进行路由级代码分割
- 懒加载非关键组件

#### 数据获取优化
- 使用SWR进行数据缓存
- 避免重复的API调用
- 实现适当的加载状态

#### 渲染优化
- 使用React.memo避免不必要的重渲染
- 优化大列表的渲染性能
- 使用虚拟滚动处理大量数据



## （十一）部署说明

### 环境变量

创建`.env.local`文件：

```env
# 认证相关
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# API端点
NEXT_PUBLIC_API_BASE_URL=http://your-api-server

# 数据库连接
DATABASE_URL=your-database-url
```

### 构建部署

1. **构建应用**
```bash
pnpm build
```

2. **启动生产服务器**
```bash
pnpm start
```

### Docker部署

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 注意事项

- 确保所有环境变量正确配置
- 检查API端点的可访问性
- 配置适当的CORS策略
- 设置生产环境的错误监控



## （十二）贡献指南

### 提交代码

1. Fork项目仓库
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -m 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 创建Pull Request

### 代码审查

- 确保代码符合项目规范
- 添加适当的测试覆盖
- 更新相关文档
- 验证功能的正确性

### 问题报告

使用GitHub Issues报告bug或请求新功能，请包含：
- 详细的问题描述
- 重现步骤
- 期望的行为
- 实际的行为
- 环境信息

---

本文档将随着项目的发展持续更新。如有疑问或建议，请联系开发团队。