'use client';

import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Document, Page } from 'react-pdf';

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

export function PdfViewer() {
  let file = '/mocked.pdf';
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  // 移除 width 状态和 ResizeObserver
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <PdfContainer>
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            <Page
              pageNumber={pageNumber}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              width={window.innerWidth * 0.8} // 使用固定基准宽度
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
    </div>
  );
}

export default function CoursewareView(){
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <PdfViewer/>
    </Box>
  );
};
