"use client";

import React, { useRef, useEffect } from "react";
import CodeEditor from "./CodeEditor";
import { Box, Button, Typography } from "@mui/material";
import TerminalIcon from "@mui/icons-material/Terminal";
import "@xterm/xterm/css/xterm.css";

export default function CodeIDE() {
  const [showTerminal, setShowTerminal] = React.useState(false);
  const [code, setCode] = React.useState(
    '// 输入JS代码\nconsole.log("Hello World")'
  );
  const terminalRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<any>(null); // xterm.Terminal 实例
  const inputBuffer = useRef("");

  async function sendCommandToBackend(command: string) {
    // 假设你的后端有 /api/terminal 这个接口
    const res = await fetch("/api/terminal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command }),
    });
    const data = await res.json();
    return data.result; // 假设后端返回 { result: "xxx" }
  }

  useEffect(() => {
    if (showTerminal && terminalRef.current && !termRef.current) {
      // 动态引入 xterm 相关依赖
      import("xterm").then(({ Terminal }) => {
        const term = new Terminal({
          fontFamily: "monospace",
          rows: 10, //行数
          convertEol: true, //启用时，光标将设置为下一行的开头
          scrollback: 10, //终端中的回滚量
          disableStdin: false, //是否应禁用输入。
          // cursorStyle: 'underline', //光标样式
          cursorBlink: true, //光标闪烁
          theme: {
            foreground: "#222", //字体
            background: "#f5f5f5", //背景色
            cursor: "#222", //设置光标
          },
        });

        term.open(terminalRef.current!);
        term.write("$ ");
        term.onData((data: string) => {
          if (data === "\r") {
            term.write("\r\n");
            // 这里只做简单命令模拟
            if (inputBuffer.current.trim() === "clear") {
              term.clear();
            } else if (inputBuffer.current.trim().startsWith("dakai")) {
              const args = inputBuffer.current.trim().split(" ");
              term.writeln(`你输入了 dakai 指令，参数为: ${args.slice(1).join(" ")}`);
            } else {
              term.writeln(`未知命令: ${inputBuffer.current.trim()}`);
            }
            inputBuffer.current = "";
            term.write("$ ");
            term.scrollToBottom();
          } else if (data === "\u007F") {
            if (inputBuffer.current.length > 0) {
              inputBuffer.current = inputBuffer.current.slice(0, -1);
              term.write("\b \b");
            }
          } else {
            inputBuffer.current += data;
            term.write(data);
          }
        });
        termRef.current = term;
      });
    }
    // 关闭时销毁 terminal
    if (!showTerminal && termRef.current) {
      termRef.current.dispose();
      termRef.current = null;
    }
  }, [showTerminal]);

  const runCode = () => {
    if (termRef.current) {
      try {
        termRef.current.writeln("--- 运行编辑器代码 ---");
        const logs: any[] = [];
        const originLog = console.log;
        console.log = (...args) => {
          logs.push(args.join(" "));
          originLog(...args);
        };
        // eslint-disable-next-line no-eval
        eval(code);
        logs.forEach((line) => termRef.current!.writeln(line));
        console.log = originLog;
        termRef.current.writeln("--- 代码运行结束 ---");
        termRef.current.write("$ ");
        termRef.current.scrollToBottom();
      } catch (e) {
        termRef.current.writeln("错误: " + String(e));
        termRef.current.scrollToBottom();
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
        bgcolor: "#f8fafc",
        borderRadius: 2,
        boxShadow: 3,
        mx: "auto",
        my: 1,
        position: "relative",
        width: "100%",
        height: "100%",
        flex: 1, // 新增
        minHeight: 300,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 0 }}>
          代码编辑器
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={runCode}
            sx={{ borderRadius: 2 }}
          >
            运行
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowTerminal(true)}
            sx={{ borderRadius: 2 }}
          >
            打开终端
          </Button>
        </Box>
      </Box>

      <CodeEditor value={code} language="javascript" onChange={setCode} />

      {/* 浮层终端 */}
      {showTerminal && (
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: 0, // 距离父容器底部24px，可调整
            width: "100%",
            height: "90", // 你想要的高度
            // maxHeight: "50%",
            bgcolor: "#e0e0e0",
            zIndex: 2000,
            boxShadow: 6,
            borderRadius: 1,
            p: 1,
            display: "flex",
            flexDirection: "column",
            color: "#fff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              gap: 1,
            }}
          >
            <TerminalIcon sx={{ color: "#222", mr: 1 }} />
            <Typography sx={{ color: "#222", fontWeight: 600, fontSize: 16 }}>
              终端
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setShowTerminal(false)}
              sx={{ color: "#fff" }}
            >
              关闭
            </Button>
          </Box>
          <Box
            ref={terminalRef}
            sx={{
              flex: 1,
              width: "99%",
              margin: "0 auto",
              background: "#18181b",
              color: "#fff",
              borderRadius: 0.5,
              fontSize: 15,
              fontFamily: "monospace",
              overflow: "auto",
              whiteSpace: "pre-wrap",
            }}
          />
        </Box>
      )}
    </Box>
  );
}
