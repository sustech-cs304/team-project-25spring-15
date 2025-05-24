'use client';

import React, { useId, useState } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import CodeIcon from '@mui/icons-material/Code';
import Link from 'next/link';
import { Box } from '@mui/material';
import CopyButton from './copy-button';

const components: Partial<Components> = {
  code: ({ node, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    if (match?.length) {
      const id = useId();
      return (
        <div className="not-prose rounded-md border">
        <div className="flex h-12 items-center justify-between bg-zinc-100 px-4 dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <CodeIcon />
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {node?.data?.meta}
            </p>
          </div>
          <CopyButton targetId={id} />
        </div>
        <div className="overflow-x-auto">
          <div id={id} className="p-4">
            {children}
          </div>
        </div>
      </div>
      );
    } else {
      return (
        <code
          {...props}
          className="not-prose rounded bg-gray-100 px-1 dark:bg-zinc-900"
        >
          {children}
        </code>
      );
    }
  },
  pre: ({ children }) => <>{children}</>,
  ol: ({ node, children, ...props }) => {
    return (
      <ol className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ol>
    );
  },
  li: ({ node, children, ...props }) => {
    return (
      <li className="py-1" {...props}>
        {children}
      </li>
    );
  },
  ul: ({ node, children, ...props }) => {
    return (
      <ul className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ul>
    );
  },
  strong: ({ node, children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    );
  },
  a: ({ node, children, ...props }) => {
    return (
      // @ts-expect-error
      <Link
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </Link>
    );
  },
  h1: ({ node, children, ...props }) => {
    return (
      <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ node, children, ...props }) => {
    return (
      <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ node, children, ...props }) => {
    return (
      <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ node, children, ...props }) => {
    return (
      <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ node, children, ...props }) => {
    return (
      <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
        {children}
      </h5>
    );
  },
  h6: ({ node, children, ...props }) => {
    return (
      <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
        {children}
      </h6>
    );
  },
};

export default function MarkdownWithRunner({ content }: { content: string }) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 2,
        width: '100%',
        height: '100%',
        maxWidth: 800,
        mx: 'auto',
        my: 4,
        p: 3,
      }}
    >
      <ReactMarkdown components={components}>
        {content}
      </ReactMarkdown>
    </Box>
  );
}
