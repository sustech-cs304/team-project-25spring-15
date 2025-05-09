import axios from 'axios';

const base_url = 'http://127.0.0.1:8000';
// 课程相关接口
export const CourseAPI = {
  // 添加课程
  addCourse: async (course: { title: string; description: string }) => {
    console.log("Adding course:", course);
    const url = ``; // 后端添加课程的接口 URL
    const response = await axios.post(url, course);
    return response.data;
  },

  // 删除课程
  deleteCourse: async (courseId: string) => {
    console.log("Deleting course with ID:", courseId);
    const url = ''; // 后端删除课程的接口 URL
    const response = await axios.delete(`${url}/${courseId}`);
    return response.data;
  },

  // 修改课程
  updateCourse: async (courseId: string, updatedCourse: { title: string; description: string }) => {
    console.log("Updating course with ID:", courseId, "to:", updatedCourse);
    const url = ''; // 后端修改课程的接口 URL
    const response = await axios.put(`${url}/${courseId}`, updatedCourse);
    return response.data;
  },
};

// 讲座相关接口
export const LectureAPI = {
  // 添加讲座
  addLecture: async (lecture: { title: string; courseId: string }) => {
    console.log("Adding lecture:", lecture);
    const url = ''; // 后端添加讲座的接口 URL
    const response = await axios.post(url, lecture);
    return response.data;
  },

  // 删除讲座
  deleteLecture: async (lectureId: string) => {
    console.log("Deleting lecture with ID:", lectureId);
    const url = ''; // 后端删除讲座的接口 URL
    const response = await axios.delete(`${url}/${lectureId}`);
    return response.data;
  },

  // 修改讲座
  updateLecture: async (lectureId: string, updatedLecture: { title: string }) => {
    console.log("Updating lecture with ID:", lectureId, "to:", updatedLecture);
    const url = ''; // 后端修改讲座的接口 URL
    const response = await axios.put(`${url}/${lectureId}`, updatedLecture);
    return response.data;
  },
};
