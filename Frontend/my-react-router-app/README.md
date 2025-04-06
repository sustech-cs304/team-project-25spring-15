# Welcome to React Router!

## Getting Started

运行代码：
```bash
npm install
npm run dev   # run 
 
npm run build # build product
```

## Introduction

### 代码框架：
```
my-ide/
├── app/
│   ├── welcome/
│   │   └── welcome.tsx        //一个 React 组件，显示欢迎页面
│   ├── routes/
│   │   ├── home.tsx           // 主页路由及其元数据
│   │   └── routes.ts          // 应用的路由配置
│   ├── app.css                // 包含 TailwindCSS 的样式配置。
│   └── root.tsx               // 应用的根组件和错误边界
├── .dockerignore
├── .gitignore
├── Dockerfile
├── README.md
├── package.json
├── react-router.config.ts     // 配置 React Router 的选项
├── tsconfig.json              // TypeScript 的配置文件
└── vite.config.ts             // Vite 的配置文件，包含了插件配置
```
### 项目运行流程
运行 `npm run dev`，Vite 启动开发服务器。