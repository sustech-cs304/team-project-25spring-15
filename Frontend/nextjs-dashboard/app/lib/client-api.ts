import axios from 'axios';
import { useStore } from '@/store/useStore';
import { AiMessage, Assignment, CmdResult } from './definitions';

// 获取认证信息的辅助函数
export async function getAuthHeader() {
  const token = useStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const IdeAPI = {
  createCmd: async () => {
    const headers = await getAuthHeader();
    try {
      const res = await axios.post(
        `/api/command/create`, {}, {headers}
      );
      // console.log(res.data);
      return res.data;
    } catch (e) {
      console.error("Fail run Cmd", e);
      return "";
    }
  },
  runCmd: async (sectionId: string | null, command: string, content: string, cwd: string): Promise<CmdResult> => {
    if (!sectionId) {
      console.error("Error run cmd: no current section.")
      return { output: "", error: "Error: no current section." };
    }
    const headers = await getAuthHeader();
    const payload = {
      sessionId: sectionId,
      command: command,
      content: content,
      cwd: cwd
    };
    try {
      const res = await axios.post(
        `/api/command/exec`, payload, {headers}
      );
      console.log(res);
      return {output: res.data.data.output, error: res.data.data.error};
    } catch (e) {
      console.error("Fail run Cmd:", command, e);
      return { output: "", error: "Fail run Cmd" };
    }
  },
  closeCmd: async (sectionId: string) => {
    const headers = await getAuthHeader();
    const payload = {sessionId: sectionId};
    try {
      const res = await axios.post(
        `/api/command/close`, payload, {headers}
      );
      console.log(res.data);
    } catch (e) {
      console.error("Fail run Cmd", e);
    }
  },
}

export const AiAPI = {
  removeMessages: async (userId: string, lectureId: string) => {
    const headers = await getAuthHeader();
    console.log("Start removing messages...");
    const payload = {
      LectureId: lectureId,
      UserId: userId
    }

    try {
      const res = await axios.post(
        `/api/ai/chat/history/clear`, payload, {headers}
      );
    } catch(e) {
      console.error("Error in removeMessage: ", e);
    }
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
    const payload = {
      codeInfo: {
        code: code_str,
      },
      type: lang
    };
    console.log("running code with payload:", payload);
    
    try {
      const res = await axios.post(`/api/codeRunner/run`, payload, {headers});
      const response = res.data.data.codeFeedback;
      console.log('Code running result:', response);

      // 检查是否有错误
      if (response.error && response.error.trim() !== "") {
        return response.error;
      } 
      // 检查是否有结果输出
      else if (response.result) {
        return response.result;
      } 
      // 没有输出的情况
      else {
        return '程序执行完毕，无输出';
      }
    } catch(e) {
      console.error(`Failed to run code:`, e);
      throw new Error(`代码执行失败: ${e instanceof Error ? e.message : '未知错误'}`);
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

  // 根据courseId获取课程详情和讲座列表
  async fetchCourseWithLectures(courseId: number) {
    try {
      const headers = await getAuthHeader();
      console.log('Fetching course with lectures for courseId:', courseId);
      console.log('Using headers:', headers);

      const response = await axios.get(`/api/course/searchCourseWithLectures/${courseId}`, {
        headers
      });

      console.log('Raw API response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      // 检查响应数据结构
      if (!response.data) {
        throw new Error('API响应为空');
      }

      // 根据API文档，数据可能在data字段中
      const responseData = response.data.data || response.data;
      console.log('Processed response data:', responseData);

      // 检查是否包含必要的字段
      if (!responseData.course && !responseData.Course) {
        console.error('响应中缺少course字段:', responseData);
        throw new Error('API响应中缺少课程数据');
      }

      // 标准化字段名（可能是course或Course）
      const course = responseData.course || responseData.Course;
      const courseIdentity = responseData.courseIdentity || responseData.CourseIdentity;

      console.log('Extracted course:', course);
      console.log('Extracted courseIdentity:', courseIdentity);

      return {
        course: course,
        courseIdentity: courseIdentity
      };
    } catch (err) {
      console.error(`Failed to fetch course with lectures:`, err);

      // 记录更详细的错误信息
      if (err instanceof Error) {
        console.error('Error message:', err.message);
      }

      // 如果是网络错误，记录响应详情
      if (axios.isAxiosError(err)) {
        console.error('Axios error details:');
        console.error('- Status:', err.response?.status);
        console.error('- Status text:', err.response?.statusText);
        console.error('- Response data:', err.response?.data);
        console.error('- Request URL:', err.config?.url);
      }

      throw err;
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
    const scores = res.data.data.scores as number[];
    const totalScores = res.data.data.totalScores as number[];
    
    console.log("Assignments:", assignments);
    console.log("Scores:", scores);
    console.log("Total Scores:", totalScores);
    
    const merged = assignments?.map((assignment, idx) => ({
      ...assignment,
      score: scores[idx] || 0, // 学生获得的分数
      totalScore: totalScores[idx] || 0, // 作业的总分值
    }));
    return merged || [];
  },

  attemptAssignment: async (attempt: {
    userId: number;
    fileId: string;
    code: string;
    fileType: string;
    assignmentId: number;
  }) => {
    const headers = await getAuthHeader();
    console.log("Attempting assignment with data:", attempt);
    
    try {
      const res = await axios.post(`/api/assignment/attemptAssignment`, {
        attempt: attempt
      }, { headers });
      
      console.log("Assignment attempt result full response:", res);
      console.log("Response status:", res.status);
      console.log("Response data:", res.data);
      console.log("Response data.data:", res.data?.data);
      console.log("Response data.data.feedback:", res.data?.data?.feedback);
      
      // 检查响应结构
      if (!res.data) {
        throw new Error("API响应为空");
      }
      
      if (!res.data.data) {
        console.error("响应缺少data字段:", res.data);
        throw new Error("API响应格式不正确：缺少data字段");
      }
      
      if (!res.data.data.feedback) {
        console.error("响应缺少feedback字段:", res.data.data);
        throw new Error("API响应格式不正确：缺少feedback字段");
      }
      
      const feedback = res.data.data.feedback;
      console.log("最终返回的feedback:", feedback);
      console.log("Feedback类型:", typeof feedback);
      console.log("Feedback的键:", Object.keys(feedback));
      
      return feedback;
    } catch (error) {
      console.error("attemptAssignment API调用失败:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios错误详情:");
        console.error("- Status:", error.response?.status);
        console.error("- Status text:", error.response?.statusText);
        console.error("- Response data:", error.response?.data);
        console.error("- Request URL:", error.config?.url);
      }
      throw error;
    }
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
  uploadFile: async (file: File) => {
    const headers = await getAuthHeader();

    const formData = new FormData();
    formData.append("file", file);

    try {
      // 根据新的API接口，使用POST方法到/api/Files
      const res = await axios.post(`/api/Files`, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("File uploaded successfully:", res.data);

      // 直接返回生成的fileId
      return res.data.data.FileId;
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
