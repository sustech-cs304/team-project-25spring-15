import axios from 'axios';
import {auth} from "@/auth";
import { useStore } from '@/store/useStore';

const base_url = 'http://47.117.144.50:8000';
const base_url_course = `${base_url}/api/course`;
const base_url_lecture = `${base_url}/api/lecture`;
// 课程相关接口

// 获取认证信息的辅助函数
async function getAuthHeader() {
  const token = useStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const CourseAPI = {
  // 获取课程列表和讲座列表
  async fetchCourses() {
    try {
      const headers = await getAuthHeader();
      console.log('Fetching courses...')
      const response = await axios.get(`/api/course/searchCourseWithLectures/byStudentId`, {
        headers
      });
      console.log('Fetched courses in client-api.ts:', response);
      return response.data.data.courses;
    } catch (err) {
      console.error(`Failed to fetch courses infomation:`, err);
    }
  },
  // 添加课程
  addCourse: async (course: { courseName: string; description: string }) => {
    console.log("Adding course:", course);
    const headers = await getAuthHeader();
    console.log("Headers:", headers)
    const payload = {
      course: {
        courseName: course.courseName,
        description: course.description,
      }
    };
    const response = await axios.post(`/api/course/createCourse`, payload, {headers});
    console.log("Course added successfully:", response);
  },

  // 删除课程
  deleteCourse: async (courseId: number) => {
    console.log(`Deleting course with ID: ${courseId}`);
    const headers = await getAuthHeader();
    const response = await axios.delete(`/api/course/deleteCourse`,
      {
        headers,
        params: {
          CourseId: courseId,
        }
      }
    );
    return response.data;
  },

  // 修改课程
  updateCourse: async (courseId: number, updatedCourse: { courseName: string; description: string }) => {
    console.log("Updating course with ID:", courseId, "to:", updatedCourse);
    const headers = await getAuthHeader();
    const payload = {
      course : {
        courseId: courseId,
        courseName: updatedCourse.courseName,
        description: updatedCourse.description,
      }
    }
    await axios.put(`/api/course/updateCourse`, payload, {headers});
  },
};

// 讲座相关接口
export const LectureAPI = {
  // 添加讲座
  addLecture: async (
    courseId: number,
    payload: { lectureName: string; description: string }
  ): Promise<void> => {
    console.log("Adding lecture to course", courseId, "with data:", payload);
    const headers = await getAuthHeader();
    await axios.post(`/api/lecture/createLecture`, {
      lecture: {
        courseId: courseId,
        lectureName: payload.lectureName,
        description: payload.description,
      },
    }, {headers});
  },

  // 删除讲座
  deleteLecture: async (courseId: number, lectureId: number) => {
    console.log("Deleting lecture with courseId:", courseId, "and lectureId:", lectureId);
    const headers = await getAuthHeader();
    const url = `/api/lecture/deleteLecture`;
    await axios.delete(url, {
      headers,
      params: { CourseId: courseId, LectureId: lectureId }
    });
  },

  // 修改讲座
  updateLecture: async (chatId: number, courseId: number, lectureId: number, updatedLecture: {
    lectureName: string;
    description: string
  }) => {
    console.log("Updating lecture with ID:", lectureId, "to:", updatedLecture);
    const headers = await getAuthHeader();
    const url = `/api/lecture/updateLecture`;
    const payload = {
      chatId: chatId,
      lecture: {
        courseId: courseId,
        lectureId: lectureId,
        lectureName: updatedLecture.lectureName,
        description: updatedLecture.description,
      }
    }
    console.log("Payload in updateLecture:", payload);
    await axios.put(url, {
      payload
    }, { headers });
  },
};
