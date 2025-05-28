'use client';

import Mermaid from "./lecture/ai/mermaid";
import Quiz from "./lecture/ai/quiz";

interface CodeBlockProps {
  node: any;
  inline: boolean;
  className: string;
  children: any;
}

export function CodeBlock({
  node,
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  if (!inline && className?.includes('language-mermaid')) {
    // children 可能是数组或字符串
    const code = Array.isArray(children) ? children.join('') : children;
    return <Mermaid code={code}/>;
  }

  const isOnlyQuizKey = (obj: any) =>
    obj && typeof obj === 'object' &&
    Object.keys(obj).length === 1 &&
    Object.keys(obj)[0] === 'quiz';

  if (!inline && className?.includes('language-json')) {
    const code = Array.isArray(children) ? children.join('') : children;
    // 假设AI输出的是JSON字符串
    let quizData;
    try {
      quizData = JSON.parse(code);
    } catch {
      return <div className="text-red-500">Quiz 数据格式错误</div>;
    }
    if(isOnlyQuizKey(quizData))
      return <Quiz quiz={quizData.quiz || quizData} />;
  }

  if (!inline) {
    return (
      <div className="not-prose flex flex-col">
        <pre
          {...props}
          className={`text-sm w-full overflow-x-auto dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl dark:text-zinc-50 text-zinc-900`}
        >
          <code className="whitespace-pre-wrap break-words">{children}</code>
        </pre>
      </div>
    );
  } else {
    return (
      <code
        className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md`}
        {...props}
      >
        {children}
      </code>
    );
  }
}
