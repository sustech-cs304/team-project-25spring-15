import { NextRequest, NextResponse } from "next/server";

const BACKEND_UPLOAD_URL = "http://47.117.144.50:8000/api/Files/lectureFile/upload";

export async function POST(req: NextRequest) {
  // 获取前端上传的 formData
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const lectureId = formData.get("lectureId");

  if (!file || !lectureId) {
    return NextResponse.json({ error: "缺少文件或 lectureId" }, { status: 400 });
  }

  const backendForm = new FormData();
  backendForm.append("LectureId", lectureId);
  backendForm.append("File", file, file.name);

  // const courseId = formData.get("courseId");
  // if (courseId) backendForm.append("courseId", courseId);

  const backendRes = await fetch(BACKEND_UPLOAD_URL, {
    method: "POST",
    body: backendForm,
  });

  if (!backendRes.ok) {
    return NextResponse.json({ error: "后端存储失败" }, { status: 500 });
  }

  return NextResponse.json({ message: "上传成功" });
}
