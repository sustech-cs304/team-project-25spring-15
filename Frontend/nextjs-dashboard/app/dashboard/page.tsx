'use client';

import { Box, Card } from '@mui/material';
import dynamic from 'next/dynamic';

const TiptapEditor = dynamic(() => import('../ui/collab/tiptap-editor'), {
  ssr: false,
});

export default function Page() {
  return (
    <div>
      <h1 className={`mb-4 text-xl md:text-2xl`}>
        Dashboard
        {/* TODO: make this prettier */}
      </h1>

      <TiptapEditor />
    </div>
  );
}
