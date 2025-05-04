import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// 这里假设你的后端服务地址
const BACKEND_BASE_URL = 'http://localhost:8000'; // 替换为你的 Go 后端实际地址和端口

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get('courseId');
  const lectureId = searchParams.get('lectureId');

  if (!courseId || !lectureId) {
    return new NextResponse('Missing parameters', { status: 400 });
  }

  const backendUrl = `${BACKEND_BASE_URL}/api/Files/lectureFile/pdf?courseId=${courseId}&lectureId=${lectureId}`;
  const backendRes = await fetch(backendUrl);

  if (!backendRes.ok) {
    return new NextResponse('PDF not found', { status: 404 });
  }

  const pdfBlob = await backendRes.blob();

  return new NextResponse(pdfBlob, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      // 可选：让 PDF 直接在浏览器内嵌显示
      'Content-Disposition': 'inline; filename="lecture.pdf"',
    },
  });
}
