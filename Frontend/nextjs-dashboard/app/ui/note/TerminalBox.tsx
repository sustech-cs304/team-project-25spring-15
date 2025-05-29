'use client';

import React, { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { Terminal } from "@xterm/xterm";

export default function TerminalBox({ terminalRef, termRef, inputBuffer, handleCommand }: any) {
  useEffect(() => {
    if (terminalRef.current && !termRef.current) {
      const term = new Terminal();
      term.open(terminalRef.current);
      term.writeln("欢迎使用 Web IDE 终端");
      term.write("$ ");
      term.onData((data) => {
        if (data === "\r") {
          term.write("\r\n");
          term.scrollToBottom();
          handleCommand(inputBuffer.current, term);
          inputBuffer.current = "";
          term.write("$ ");
          term.scrollToBottom();
        } else if (data === "\u007F") {
          if (inputBuffer.current.length > 0) {
            inputBuffer.current = inputBuffer.current.slice(0, -1);
            term.write("\b \b");
            term.scrollToBottom();
          }
        } else {
          inputBuffer.current += data;
          term.write(data);
          term.scrollToBottom();
        }
      });
      termRef.current = term;
    }
  }, []);
  return (
    <Box
      ref={terminalRef}
      sx={{
        height: "120",
        width: "100%",
        background: "#fff",
        color: "#222",
        borderRadius: 2,
        boxShadow: 1,
        p: 1,
        fontSize: 15,
        fontFamily: "monospace",
        whiteSpace: "pre-wrap",
      }}
    />
  );
}
