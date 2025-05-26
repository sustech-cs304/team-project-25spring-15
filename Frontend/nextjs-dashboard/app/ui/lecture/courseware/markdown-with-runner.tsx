"use client";

import React, { useId, useState } from "react";
import Link from "next/link";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import CodeIcon from "@mui/icons-material/Code";
import { Box } from "@mui/material";

import "highlight.js/styles/atom-one-dark.css";

import CopyButton from "./copy-button";
import RunButton from "./run-button";
import EditButton from "./edit-button";

function childrenToString(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) {
    return children.map(childrenToString).join("");
  }
  if (React.isValidElement<any>(children)) {
    // 处理 <br /> 换行
    if (children.type === "br") return "\n";
    // 递归处理其子节点
    return childrenToString((children as React.ReactElement<any>).props.children);
  }
  return "";
}

const components: Partial<Components> = {
  code: ({ node, className, children, ...props }) => {
    const id = useId();
    const id2 = useId();
    const match = /language-(\w+)/.exec(className || "");
    const language = match?.[1] || 'text';
    const codeStr = childrenToString(children);
    // console.log(`temp code: ${codeStr}`);
    const [editing, setEditing] = useState(false);
    const [editableCode, setEditableCode] = useState(codeStr);

    const [output, setOutput] = useState<string>("");

    if (match?.length) {
      return (
        <div className="not-prose rounded-md border">
          <div className="flex h-12 items-center justify-between bg-zinc-100 px-4 dark:bg-zinc-900">
            <div className="flex items-center gap-2">
              <CodeIcon />
              <p className="text-base font-semibold text-zinc-600 dark:text-zinc-400">
                {language}
              </p>
              <p className="text-base font-semibold text-zinc-600 dark:text-zinc-400">
                {node?.data?.meta}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton targetId={id} />
              <RunButton
                targetId={id}
                onRun={setOutput}
                language={language || "plain text"}
              />
              <EditButton
                editing={editing}
                onToggle={() => setEditing(e => !e)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            {editing ? (
              <textarea
                id={id2}
                className="w-full p-4 text-base font-mono bg-white dark:bg-zinc-900 border-none outline-none"
                style={{ minHeight: 180, resize: "none" }}
                value={editableCode}
                onChange={e => setEditableCode(e.target.value)}
              />
            ) : (
              <pre
                id={id}
                className="w-full p-4 text-base font-mono bg-white dark:bg-zinc-900 border-none outline-none"
                style={{ minHeight: 180, resize: "none" }}
              >
                {editableCode}
              </pre>
            )}
          </div>
          {/* <div className="overflow-x-auto">
            <div className="overflow-x-auto">
              <pre className="p-4 overflow-x-auto text-base">
                {children}
              </pre>
            </div>
          </div> */}
            <div className="bg-gray-100 dark:bg-zinc-800 rounded px-4 py-2 mx-4 mb-4 text-base min-h-[24px] mt-2 whitespace-pre-wrap">
              <span className="text-sm text-gray-500">运行结果：</span>
              <div>{output}</div>
            </div>
        </div>
      );
    } else {
      return (
        <code
          {...props}
          className="not-prose rounded bg-gray-100 px-1 dark:bg-zinc-900 text-base"
        >
          {children}
        </code>
      );
    }
  },
  pre: ({ children }) => <pre className="text-lg">{children}</pre>,
  ol: ({ node, children, ...props }) => {
    return (
      <ol className="list-decimal list-outside ml-4 text-base" {...props}>
        {children}
      </ol>
    );
  },
  li: ({ node, children, ...props }) => {
    return (
      <li className="py-1 text-base" {...props}>
        {children}
      </li>
    );
  },
  ul: ({ node, children, ...props }) => {
    return (
      <ul className="list-decimal list-outside ml-4 text-base" {...props}>
        {children}
      </ul>
    );
  },
  strong: ({ node, children, ...props }) => {
    return (
      <span className="font-semibold text-base" {...props}>
        {children}
      </span>
    );
  },
  a: ({ node, children, ...props }) => {
    return (
      // @ts-expect-error
      <Link
        className="text-blue-500 hover:underline text-base"
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
      <h1 className="text-4xl font-bold mt-6 mb-2" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ node, children, ...props }) => {
    return (
      <h2 className="text-3xl font-bold mt-6 mb-2" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ node, children, ...props }) => {
    return (
      <h3 className="text-2xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ node, children, ...props }) => {
    return (
      <h4 className="text-xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ node, children, ...props }) => {
    return (
      <h5 className="text-lg font-semibold mt-6 mb-2" {...props}>
        {children}
      </h5>
    );
  },
  h6: ({ node, children, ...props }) => {
    return (
      <h6 className="text-base font-semibold mt-6 mb-2" {...props}>
        {children}
      </h6>
    );
  },
  table: ({ children, ...props }) => (
    <table
      className="min-w-full border border-gray-300 my-4 text-base"
      {...props}
    >
      {children}
    </table>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-gray-100 dark:bg-zinc-800" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
  tr: ({ children, ...props }) => (
    <tr className="border-b border-gray-200" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th
      className="px-4 py-2 font-bold text-left border border-gray-300 bg-gray-50 dark:bg-zinc-700"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-4 py-2 border border-gray-300" {...props}>
      {children}
    </td>
  ),
};

export default function MarkdownWithRunner({ content }: { content: string }) {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 2,
        width: "100%",
        height: "100%",
        maxWidth: 800,
        mx: "auto",
        my: 4,
        p: 3,
      }}
    >
      <ReactMarkdown
        components={components}
        rehypePlugins={[rehypeHighlight]}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}
