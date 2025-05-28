'use client';

import MarkdownWithRunner from "@/app/ui/lecture/courseware/markdown-with-runner";
import { mocked_markdown_example } from "@/app/lib/mocked-data";
import { useEffect, useRef, useState } from "react";
import { CourseWareAPI } from "@/app/lib/client-api";
import { Button } from "@mui/material";

type MarkdunnerProps = {
  courseId: string;
  lectureId: string;
}

export default function Markdunner({ courseId, lectureId }: MarkdunnerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  // 加载 lectureId 对应的 markdown
  useEffect(() => {
    async function fetchMarkdown() {
      try {
        const res = await CourseWareAPI.getMarkdown(lectureId);
        if (res && res.data) {
          const text = await res.data.text();
          // console.log(text);
          setMarkdownContent(text);
        } else {
          setMarkdownContent("Not having markdown file yet.");
        }
      } catch {
        console.error("Fail fetching markdown file");
        setMarkdownContent(mocked_markdown_example);
      }
    }
    fetchMarkdown();
  }, [lectureId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.md')) {
      alert('只支持上传 .md 文件');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("lectureId", lectureId);

    // 假设你的后端接口为 /api/upload-md
    const res = await CourseWareAPI.uploadMarkdown(formData);
    // TODO: modify the logic
    if (res) {
      alert("上传成功！");
      // 你可以在这里处理上传后的逻辑，比如刷新页面或获取新内容
    } else {
      alert("上传失败！");
    }
    setUploading(false);

    const res2 = await CourseWareAPI.getMarkdown(lectureId);
    const blob = res2.data as Blob;
    const text = await blob.text();
    console.log(text);
    setMarkdownContent(text);
  };

  return (
    <div>
      <div className="flex justify-end">
        <Button
          variant="outlined"
          component="label"
          disabled={uploading}
          className="mb-4"
          style={{ textTransform: "none" }}
        >
          {uploading ? "上传中..." : "上传 Markdown Notes"}
          <input
            type="file"
            accept=".md"
            hidden
            onChange={handleFileChange}
          />
        </Button>
      </div>
      <input
        type="file"
        accept=".md"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <MarkdownWithRunner content={markdownContent} />
    </div>
  );
}
