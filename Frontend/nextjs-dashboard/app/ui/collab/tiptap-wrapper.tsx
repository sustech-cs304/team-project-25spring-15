'use client';

import { User } from 'next-auth';
import dynamic from 'next/dynamic';

interface TopbarProps {
  user?: User;
}

const TiptapEditor = dynamic(() => import('./tiptap-editor'), {
  ssr: false,
});

export default function TiptapWrapper({ user }: TopbarProps) {
  return (
    <div>
      <h1 className={`mb-4 text-xl md:text-2xl`}>
        Dashboard
        {/* TODO: make this prettier */}
      </h1>

      <TiptapEditor user={user} />
    </div>
  );
}
