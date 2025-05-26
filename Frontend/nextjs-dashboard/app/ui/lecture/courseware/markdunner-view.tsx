'use client';

import MarkdownWithRunner from "@/app/ui/lecture/courseware/markdown-with-runner";
import { mocked_markdown_example } from "@/app/lib/mocked-data";

export default function Markdunner() {
  return (
  <div>
    <MarkdownWithRunner content={mocked_markdown_example} />
  </div>
  );
}
