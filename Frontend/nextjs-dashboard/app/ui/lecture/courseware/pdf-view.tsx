'use client';

import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Document, Page } from 'react-pdf';
import { CourseWareAPI } from '@/app/lib/client-api'
import { useStore } from '@/store/useStore';
import { usePermissions } from '@/app/lib/permissions';
import { useMessage } from '@/app/hooks/useMessage';

import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// 添加自定义样式组件
const PdfContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  '& .react-pdf__Document': {
    maxWidth: '100%',
  },
  '& .react-pdf__Page': {
    maxWidth: '100%',
  },
  '& .react-pdf__Page__canvas': {
    maxWidth: '100% !important',
    height: 'auto !important',
  }
});

type PdfViewProps = {
  courseId: string;
  lectureId: string;
};

export default function PdfView({ courseId, lectureId }: PdfViewProps) {
  const [fileUrl, setFileUrl] = useState<string>();
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [uploading, setUploading] = useState(false);

  // 添加权限管理
  const userInfo = useStore(state => state.userInfo);
  const courses = useStore(state => state.courses);
  const courseIdentity = useStore(state => state.courseIdentity);
  
  const currentCourse = courses.find(course => course.courseId === parseInt(courseId));
  const permissions = usePermissions(userInfo, currentCourse?.teacherId, courseIdentity);

  // 使用消息弹窗
  const { success, error, warning, MessageComponent } = useMessage();

  useEffect(() => {
    const featchPdf = async () => {
      try {
        const res = await CourseWareAPI.getPdf(lectureId);
        const fileBlob = res.data;
        const url = URL.createObjectURL(fileBlob);
        console.log(`file url: ${url}`);
        setFileUrl(url);
      } catch (e) {
        setFileUrl('/mocked.pdf');
        console.log(`file url: mocked`);
      };
    }
    featchPdf();
  }, [lectureId]);

  // 移除 width 状态和 ResizeObserver
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  // 上传文件
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!permissions.canEditExercise) {
      warning('您没有权限上传PDF');
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    // formData.append("courseId", courseId);
    formData.append("lectureId", lectureId);

    try {
      const res = await CourseWareAPI.uploadPdf(file, lectureId);
      if (res.status === 200) {
        success('上传成功！');
        window.location.reload();
      } else {
        error('上传失败');
      }
      const blob = await CourseWareAPI.getPdf(lectureId);
      const fileBlob = blob.data;
      const fileUrl = URL.createObjectURL(fileBlob);
      setFileUrl(fileUrl);
    } catch {
      error('上传出错');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 只有有权限的用户才能看到上传按钮 */}
      {permissions.canEditExercise && (
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="outlined" component="label" disabled={uploading}>
          {uploading ? "上传中..." : "上传PDF"}
          <input
            type="file"
            accept="application/pdf"
            hidden
            onChange={handleFileChange}
          />
        </Button>
      </Box>
      )}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <PdfContainer>
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div>加载中...</div>}
            error={<div>PDF 加载失败</div>}
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            // width={window.innerWidth * 0.8} // 使用固定基准宽度
            />
          </Document>
        </PdfContainer>
      </div>

      {/* 底部控制区域 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
        <Button
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber(pageNumber - 1)}
          variant="contained"
          sx={{ mx: 1 }}
        >
          上一页
        </Button>

        <Typography variant="body1" sx={{ mx: 2, display: 'flex', alignItems: 'center' }}>
          第 {pageNumber} 页 / 共 {numPages} 页
        </Typography>

        <Button
          disabled={pageNumber >= (numPages ?? 0)}
          onClick={() => setPageNumber(pageNumber + 1)}
          variant="contained"
          sx={{ mx: 1 }}
        >
          下一页
        </Button>
      </Box>
      
      {/* 消息弹窗 */}
      <MessageComponent />
    </div>
  );
}
