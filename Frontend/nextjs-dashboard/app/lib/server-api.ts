import {auth} from "@/auth";
import axios from "axios";
import { AiMessage } from "./definitions";
import { getAuthHeader } from "./client-api";

export async function fetchCourses() {
  const senssion = await auth();
  console.log("Session in layout:", senssion);
  const res = await axios.get(`http://47.117.144.50:8000/api/course/searchCourseWithLectures/byStudentId`, {
    headers: { Authorization: `Bearer ${senssion?.user?.token}` }
  });
  console.log("Fetched courses:", res.data);
  const courses = res.data.data.courses
  return courses || [];
}

export const AiMessageAPI = {
  saveMessage: async (message: AiMessage) => {
    const senssion = await auth();

    try {
      console.log("Saving message from ai...");
      const res = await axios.post( //TODO: TO BE SPECIFIED ！！
        `http://47.117.144.50:8000/api/ai/chat/message/store`, JSON.stringify(message),
        {headers: { Authorization: `Bearer ${senssion?.user?.token}` }}
      );
      if (res.data && res.data.error) {
        console.error("saveMessage后端返回错误:", res.data.error);
        return { error: res.data.error };
      }
      return res.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        console.error("saveMessage请求异常:", error.response.data.error);
        return { error: error.response.data.error };
      }
      console.error("saveMessage请求失败:", error);
      return { error: "saveMessage请求失败" };
    }

  },
  getMessages: async (userId: string, lectureId: string) => {
    // order is required!!!
    const session = await auth();
    console.log("Start fetching messages...");

    try {
      const res = await axios.get(
        `http://47.117.144.50:8000/api/ai/chat/history/get`, {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          },
          params: {
            LectureId: lectureId,
            UserId: userId
          }}
      );
      return res.data.data as AiMessage[];
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        console.error("getMessages请求异常:", error.response.data.error);
      }
      console.error("getMessages请求失败:", error);
      return [];
    }
  }
}
