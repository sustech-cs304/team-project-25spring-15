import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import type { Route } from "./+types/root";
import "./app.css";

// 通过MUI提供整个应用的主题，传递给所有子组件
const theme = createTheme({
  palette: {
    primary: { main: "#2E3B55" },
    secondary: { main: "#4CAF50" },
  },
  components: {
    MuiDrawer: {
      styleOverrides: { paper: { backgroundColor: "#f5f6fa" } },
    },
  },
});

// links函数
//  用于加载外部资源（如字体、样式表等）
//  在 Layout 组件中，React Router 的 <Links /> 组件会自动调用 links 函数，
//  调用以后相当于增加这些配置信息，如 <link rel="preconnect" href="https://fonts.googleapis.com" />
export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// Layout 函数组件
//  定义了页面的基础HTML结构，包括 <html>、<head> 和 <body> 标签
//  最终会被 React 渲染为HTML
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        {/* <Links /> */}
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// 根组件 App
//  通过 <Outlet /> 渲染当前匹配的子路由组件
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Outlet/>
    </ThemeProvider>
  )
}

// 报错页面
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
