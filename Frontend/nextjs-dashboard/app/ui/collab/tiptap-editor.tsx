'use client';

import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { EditorContent, useEditor } from '@tiptap/react'
import React, { useEffect } from 'react'

import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Placeholder from '@tiptap/extension-placeholder'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

const doc = new Y.Doc() // Initialize Y.Doc for shared editing
const provider = new WebrtcProvider('asdhfjoifjoahsidf', doc);

export default function TiptapEditor() {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Collaboration.configure({
        document: doc, // Configure Y.Doc for collaboration
      }),
      CollaborationCursor.configure({
        provider,
        user: {
          name: 'Cyndi Lauper',
          color: '#f783ac',
        },
      }),
      Placeholder.configure({
        placeholder:
          'Write something … It’ll be shared with everyone else looking at this example.',
      }),
    ],
    content: `
      <p>
        This is a radically reduced version of Tiptap. It has support for a document, with paragraphs and text. That’s it. It’s probably too much for real minimalists though.
      </p>
      <p>
        The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.
      </p>
    `,
  })
  return (
    <EditorContent editor={editor} />
  )
}
