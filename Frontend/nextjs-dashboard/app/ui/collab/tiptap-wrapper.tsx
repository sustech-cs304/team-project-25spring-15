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
      <TiptapEditor user={user} />
    </div>
  );
}
