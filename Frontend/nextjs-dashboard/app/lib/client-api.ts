import axios from 'axios';
import { useStore } from '@/store/useStore';
import {AiMessage, Assignment} from './definitions';

// 获取认证信息的辅助函数
export async function getAuthHeader() {
  const token = useStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const CmdAPI = {
  sendCmd: async () => {
    const headers = await getAuthHeader();
    console.log("Start fetching result of cmd: ");
  }
}

export const AiMessageAPI = {
  saveMessage: async (message: AiMessage) => {
    const headers = await getAuthHeader();

    console.log("Saving message from ai...");
    // const res = await axios.post( //TODO: TO BE SPECIFIED ！！
    //   `/api/`, message, { headers }
    // );
    // return res;
  },
  getMessages: async (userId: string, lectureId: string) => {
    // order is required!!!
    const headers = await getAuthHeader();
    console.log("Start fetching messages...");
    //
    return [];
  }
}

export const CourseWareAPI = {
  uploadPdf: async (file: File, lectureId: string) => {
    const headers = await getAuthHeader();

    console.log("uploading pdf...");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("lectureId", lectureId);
    const res = axios.post("/api/Files/lectureFile/upload", formData, {headers});

    console.log(res);
    return res;
  },
  getPdf: async (lectureId: string) => {
    const headers = await getAuthHeader();
    console.log("fetching pdf...");

    const res = await axios.get(
      `/api/Files/lectureFile/lecture/${lectureId}`,
      { headers, responseType: 'blob' }
    );
    return res;
  },
  uploadMarkdown: async (formData: FormData) => {
    const headers = await getAuthHeader();

    console.log("uploading pdf...");
    const res = axios.post("/api/Files/lectureNote/upload", formData, {headers});

    console.log(res);
    return res;
  },
  getMarkdown: async (lectureId: string) => {
    const headers = await getAuthHeader();
    console.log("fetching pdf...");

    const res = await axios.get(
      `/api/Files/lectureNote/lecture/${lectureId}`,
      { headers, responseType: 'blob' }
    );
    return res;
  }
}

export const CodeAPI = {
  runCode: async (code_str: string, lang: string) => {
    const headers = await getAuthHeader();
    console.log("running code...");
    const payload = {
      codeInfo: {
        code: code_str,
      },
      type: lang
    };
    const res = await axios.post(`/api/codeRunner/run`, payload, {headers});
    const response = res.data.data.codeFeedback;
    console.log('Code running result:', response);

    try {
      if(response.error && response.error.trim() !== "") {
        return response.error;
      } else if (response.result) {
        return response.result;
      } else {
        console.error("Nothing to show, please check!");
      }
    } catch(e) {
      console.error(`Failed to fetch courses infomation:`, e);
    }
  }
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
  addCourse: async (course: {
    courseName: string;
    description: string;
    startTime?: string;
    endTime?: string;
  }) => {
    const headers = await getAuthHeader();
    console.log("Headers:", headers)
    const payload = {
      course: {
        courseName: course.courseName,
        description: course.description,
        startTime: course.startTime || new Date().toISOString(),
        endTime: course.endTime || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }
    };
    console.log("Adding course:", payload);
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

  // 获取课程的学生列表
  getCourseStudents: async (courseId: number) => {
    console.log(`Fetching students for course ID: ${courseId}`);
    const headers = await getAuthHeader();
    try {
      const response = await axios.get(`/api/course/getAllStudentsOfACourse/${courseId}`, {
        headers,
      });
      console.log('Fetched students:', response.data);
      return response.data.data.students || [];
    } catch (err) {
      console.error(`Failed to fetch students:`, err);
      return [];
    }
  },

  // 添加学生到课程
  addStudentToCourse: async (courseId: number, email: string) => {
    console.log(`Adding student with email ${email} to course ID: ${courseId}`);
    const headers = await getAuthHeader();
    const payload = {
      courseId,
      studentsEmail: [email]
    };
    console.log('Payload for adding student:', payload);
    const response = await axios.post(`/api/course/addStudents`, payload, {headers});
    console.log('Student added successfully:', response.data);
    return response.data;
  },

  // 从课程中移除学生
  removeStudentFromCourse: async (courseId: number, studentId: number) => {
    console.log(`Removing student ID ${studentId} from course ID: ${courseId}`);
    const headers = await getAuthHeader();
    const response = await axios.delete(`/api/course/removeStudent`, {
      headers,
      params: {
        courseId,
        studentId
      }
    });
    console.log('Student removed successfully:', response.data);
    return response.data;
  },

  // 指定课程助教
  assignCourseAssistant: async (courseId: number, assistantId: number) => {
    console.log(`Assigning assistant ID ${assistantId} to course ID: ${courseId}`);
    const headers = await getAuthHeader();
    const payload = {
      courseId,
      assistantId
    };
    console.log('Payload for assigning assistant:', payload);
    const response = await axios.post(`/api/course/assignCourseAssistant`, payload, {headers});
    console.log('Assistant assigned successfully:', response.data);
    return response.data;
  },

  removeCourseAssistant: async (courseId: number, assistantId: number) => {
    console.log(`Removing assistant ID ${assistantId} from course ID: ${courseId}`);
    const headers = await getAuthHeader();
    const payload = {
      courseId,
      assistantId
    };
    console.log('Payload for removing assistant:', payload);
    const response = await axios.delete(`/api/course/unassignCourseAssistant`, {
      headers,
      params: {
        courseId,
        assistantId
      }
    });
    console.log('Assistant removed successfully:', response.data);
    return response.data;
  }
};

// 讲座相关接口
export const LectureAPI = {
  // 获取课程的所有讲座
  fetchLecturesByCourse: async (courseId: number) => {
    console.log(`Fetching lectures for course ID: ${courseId}`);
    const headers = await getAuthHeader();
    try {
      const response = await axios.get(`/api/lecture/getLectures/${courseId}`, {
        headers
      });
      console.log('Fetched lectures for course:', response.data);
      return response.data.data.lectures || [];
    } catch (err) {
      console.error(`Failed to fetch lectures for course ID ${courseId}:`, err);
      return [];
    }
  },

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
    await axios.put(url, payload, { headers });
  },
};

export const CommentAPI = {
  fetchComments : async (lectureId: number) => {
    try {
      const headers = await getAuthHeader();
      console.log("Fetching comments for lectureId:", lectureId);
      const response = await axios.get(`/api/comment/getComment/${lectureId}`, {headers});
      console.log("获取评论成功:", response.data.data);
      return response.data.data.comment || [];
    } catch (error) {
      console.error("获取评论失败:", error);
    }
  },

  publishComment: async (
    newCommentData: {
      lectureId: number | null,
      content: string | null,
      authorId: number | null,
      createTime: string | null,
      repliedToCommentId: number | null,
    }) => {
    console.log("Publishing comment with data:", newCommentData);
    const headers = await getAuthHeader();
    const payload = {
      comment: newCommentData
    };
    await axios.post(`/api/comment/createComment`, payload, {headers});
  },

  deleteComment: async (commentId: number, userId: number) => {
    console.log("Deleting comment with ID:", commentId);
    const headers = await getAuthHeader();
    const res = await axios.delete(`/api/comment/deleteComment`, {
      headers,
      params: {
        commentId: commentId,
        userId: userId
      }
    });
    console.log("Comment deleted successfully:", res.data);
    return res.data;
  },

  likeComment: async (
    payload: {
      userId: number
      commentId: number
      likes: number
    }) => {
    const headers = await getAuthHeader();
    await axios.put(`/api/comment/updateComment`, payload, {headers});
  }

}

export const AssignmentAPI = {
  fetchAssignments : async (lectureId: number) => {
    console.log("Fetching assignments for lectureId:", lectureId);
    const headers = await getAuthHeader();
    const res = await axios.get(`/api/assignment/getAllAssignmentOfALecture`,
      {
        params: {
          lectureId: lectureId,
        },
        headers
      });
    console.log("Fetched assignments:", res);
    const assignments = res.data.data.assignments as Assignment[];
    const score       = res.data.data.scores       as number[];
    console.log("Score: ", score)
    const merged = assignments?.map((assignment, idx) => ({
      ...assignment,
      score: score[idx],
    }));
    return merged || [];
  },

  createAssignment: async (assignment: Assignment, courseName: string | undefined, chatId: number | undefined) => {
    const headers = await getAuthHeader();
    const payload = {
      assignment: {
        ...assignment,
      },
      courseName: courseName,
      chatId: chatId,
    };
    console.log("Creating assignment:", payload);
    const res = await axios.post(`/api/assignment/createAssignment`, payload, {headers});
    console.log("Assignment created successfully:", res.data);
  },

  updateAssignment: async (assignment: Assignment, courseName: string, chatId: number) => {
    const headers = await getAuthHeader();
    console.log("Updating assignment:", assignment);
    const res = await axios.put(`/api/assignment/updateAssignment`, {
      assignment: assignment,
      courseName: courseName,
      chatId: chatId,
    }, {headers});
    console.log("Assignment updated successfully:", res.data);
  },

  deleteAssignment: async (assignmentId: number, courseId: number) => {
    const headers = await getAuthHeader();
    console.log("Deleting assignment with ID:", assignmentId, "for courseId:", courseId);
    const res = await axios.delete(`/api/assignment/deleteAssignment`, {
      headers,
      params: {
        assignmentId: assignmentId,
        courseId: courseId,
      }
    });
    console.log("Assignment deleted successfully:", res.data);
    return res.data;
  }
}

export const FileAPI = {
  uploadFile: async (file: File, lectureId: number) => {
    const headers = await getAuthHeader();

    const formData = new FormData();
    formData.append("lectureId", lectureId.toString());
    formData.append("file", file);

    try {
      const res = await axios.post(`/api/Files/lectureFile/upload`, formData, { headers });

      console.log("File uploaded successfully:", res.data);

      // 确保返回格式符合API文档
      return {
        result: res.data.result,
        fileId: res.data.fileId
      };
    } catch (error) {
      console.error("File upload failed:", error);
      throw error;
    }
  },

  getFile: async (lectureId: number) => {
    const headers = await getAuthHeader();
    console.log("Fetching file for lectureId:", lectureId);
    const res = await axios.get(`/api/Files/lectureFile/lecture/${lectureId}`, {
      headers,
      responseType: 'blob'
    });
    console.log("File fetched successfully:", res.data);
    return res.data;
  }
}
