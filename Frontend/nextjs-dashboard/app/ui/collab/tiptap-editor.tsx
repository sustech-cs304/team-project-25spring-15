'use client';

import React, { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import { Box } from '@mui/material';
import { User } from 'next-auth';

import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'

import * as Y from 'yjs'

interface TopbarProps {
  user?: User;
}

const doc = new Y.Doc() // Initialize Y.Doc for shared editing

import { HocuspocusProvider } from "@hocuspocus/provider";

const provider = new HocuspocusProvider({
  url: "ws://127.0.0.1:1234",
  name: "example-document",
  document: doc,
});

// // Define `tasks` as an Array
// const tasks = provider.document.getArray("tasks");

// // Listen for changes
// tasks.observe(() => {
//   console.log("tasks were modified");
// });

// // Add a new task
// tasks.push(["buy milk"]);

export default function TiptapEditor({ user }: TopbarProps) {

  // 生成用户颜色（可根据用户ID或邮箱hash等自定义）
  function getUserColor(nameOrEmail: string) {
    // 简单哈希生成颜色
    const colors = ['#f783ac', '#6c63ff', '#ffb347', '#00b894', '#fd79a8']
    let hash = 0
    for (let i = 0; i < nameOrEmail.length; i++) {
      hash = nameOrEmail.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }

  const userName = user?.name || "Anonymous";
  const userColor = getUserColor(user?.email || userName)

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Highlight,
      Typography,
      Collaboration.configure({
        document: doc, // Configure Y.Doc for collaboration
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: {
          name: userName,
          color: userColor,
        },
      }),
      Placeholder.configure({
        placeholder:
          'Write something … It’ll be shared with everyone else looking at this example.',
      }),
    ],
  })

  return (
    <Box
      sx={{
        background: '#fff',
        borderRadius: 2,
        boxShadow: 3,
        p: { xs: 2, md: 4 },
        mt: 2,
        mb: 2,
        minHeight: 300,
        maxWidth: 900,
        mx: 'auto',
      }}
    >
      <EditorContent editor={editor} />
    </Box>
  )
}
