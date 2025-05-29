"use client";

import React, { useRef, useEffect } from "react";
import CodeEditor from "./CodeEditor";
import { IdeAPI } from "@/app/lib/client-api";
import { Box, Button, Typography } from "@mui/material";
import TerminalIcon from "@mui/icons-material/Terminal";
import "@xterm/xterm/css/xterm.css";

export default function CodeIDE() {
  const [showTerminal, setShowTerminal] = React.useState(false);
  const [code, setCode] = React.useState(
    '// 请使用cat打开文件'
  );
  const codeRef = useRef(code);
  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  const terminalRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<any>(null); // xterm.Terminal 实例
  const inputBuffer = useRef("");
  const sectionIdRef = useRef<string | null>(null);
  const fileNameRef = useRef<string | null>(null);

  async function sendCommandToBackend(command: string) {
    // 假设你的后端有 /api/terminal 这个接口
    console.log(sectionIdRef.current);
    const res = await IdeAPI.runCmd(sectionIdRef.current, command, "", "");
    console.log(res);
    if (res.error && res.error !== "")
      return res.error;
    else
      return res.output; // 假设后端返回 { result: "xxx" }
  }

  async function saveFileToBackend(command: string, content: string, cwd: string) {
    // 假设你的后端有 /api/terminal 这个接口
    console.log(sectionIdRef.current);
    const res = await IdeAPI.runCmd(sectionIdRef.current, command, content, cwd);
    console.log(res);
    if (res.error && res.error !== "")
      return res.error;
    else
      return res.output; // 假设后端返回 { result: "xxx" }
  }

  useEffect(() => {
    IdeAPI.createCmd().then((res) => {
      let sectionId: string | null = null;
      if (res && typeof res === "object" && "data" in res && res.data?.sessionId) {
        sectionId = res.data.sessionId;
      }
      // console.log(sectionId);
      sectionIdRef.current = sectionId;
    });

    return () => {
      if (sectionIdRef.current) {
        IdeAPI.closeCmd(sectionIdRef.current);
      }
    };
  }, []);

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

            if (inputBuffer.current.trim() === "") { // 如果输入为空，只换行
                term.write("$ ");
                return;
              }

            if (inputBuffer.current.trim() === "clear") { // clear
              term.clear();
            } else if (inputBuffer.current.trim().startsWith("cat")) { // cat file.py
              const args = inputBuffer.current.trim().split(" ");
              fileNameRef.current = args.slice(1).join(" ");
              term.writeln(`你输入了 cat 指令，参数为: ${args.slice(1).join(" ")}`);
              sendCommandToBackend(inputBuffer.current).then((result) => {
                setCode(result);
              });
              term.writeln(`successfully cat ${fileNameRef.current}`);
            } else if(inputBuffer.current.trim().startsWith("save")) {
              sendCommandToBackend("pwd").then((result) => {
                const cleanResult = result.replace(/[\r\n]+/g, "");
                const path = cleanResult + '/' + fileNameRef.current;
                console.log(path);
                saveFileToBackend("save " + path , codeRef.current , cleanResult).then((result) => {
                  console.log(result);
                });
              })
              term.writeln(`successfully save file`);
            } else {
              sendCommandToBackend(inputBuffer.current).then((result) => {
                if(result !== undefined) {
                  const cleanResult = String(result).replace(/[\r\n]+$/g, "");
                  term.writeln(`${cleanResult}`);
                }
              })
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

  console.log(code);

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
