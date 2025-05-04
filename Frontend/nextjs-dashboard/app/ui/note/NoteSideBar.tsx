"use client";

import { useState } from "react";
import { Box, IconButton, Drawer } from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import MarkdownEditor from "@/app/ui/note/MarkdownEditor";

export default function NoteSidebar() {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("# 这里是你的笔记...");

  return (
    <>
      {/* 展开按钮，固定在右侧中间 */}
      <IconButton
        sx={{
          position: "fixed",
          top: "50%",
          right: 24,
          zIndex: 1301,
          transform: "translateY(-50%)",
          bgcolor: "#fff",
          boxShadow: 2,
        }}
        onClick={() => setOpen(true)}
        color="primary"
      >
        <NoteAddIcon />
      </IconButton>
      {/* 右侧滑出 Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { width: { xs: "90vw", sm: 420 }, p: 2 },
        }}
      >
        <Box
          sx={{
            position: "fixed",
            top: 64, // 避开 Topbar
            right: 0,
            height: "calc(100vh - 64px)",
            width: { xs: "90vw", sm: 420 },
            bgcolor: "#fff",
            borderLeft: "1px solid #eee",
            boxShadow: 3,
            zIndex: 1200,
            p: 2,
            overflowY: "auto",
          }}
        >
          <MarkdownEditor value={note} onChange={setNote} />
        </Box>
      </Drawer>
    </>
  );
}
