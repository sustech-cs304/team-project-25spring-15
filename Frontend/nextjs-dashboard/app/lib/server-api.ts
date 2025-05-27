import {auth} from "@/auth";
import axios from "axios";

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
