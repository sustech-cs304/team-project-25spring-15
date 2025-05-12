import axios from 'axios';

const base_url = 'http://47.117.144.50:8000';
// 课程相关接口
let base_url_course;
export const CourseAPI = {
  base_url_course: `${base_url}/api/course`,
  // 添加课程
  addCourse: async (course: { courseName: string; description: string }) => {
    console.log("Adding course:", course);
    await axios.post(`${base_url_course}/createCourse`, course);
  },

  // 删除课程
  deleteCourse: async (courseId: number) => {
    console.log(`Deleting course with ID: ${courseId}`);
    const response = await axios.delete(`${base_url_course}/deleteCourse`,
      {
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
    await axios.put(`${base_url_course}/${courseId}`, updatedCourse);
  },
};

// 讲座相关接口
export const LectureAPI = {
  base_url_lecture: `${base_url}/api/course`,
  // 添加讲座
  addLecture: async (
    courseId: number,
    payload: { lectureName: string; description: string }
  ): Promise<void> => {
    console.log("Adding lecture to course", courseId, "with data:", payload);
    const url = `${base_url_course}/addLecture`;
    await axios.post(url, {
      courseId,
      lectureName: payload.lectureName,
      description: payload.description,
    });
  },

  // 删除讲座
  deleteLecture: async (lectureId: number) => {
    console.log("Deleting lecture with ID:", lectureId);
    const url = ''; // 后端删除讲座的接口 URL
    const response = await axios.delete(`${url}/${lectureId}`);
  },

  // 修改讲座
  updateLecture: async (lectureId: number, updatedLecture: { lectureName: string, description: string }) => {
    console.log("Updating lecture with ID:", lectureId, "to:", updatedLecture);
    const url = ''; // 后端修改讲座的接口 URL
    const response = await axios.put(`${url}/${lectureId}`, updatedLecture);
  },
};
