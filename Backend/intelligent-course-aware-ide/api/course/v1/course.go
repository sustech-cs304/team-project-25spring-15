package v1

import (
	"intelligent-course-aware-ide/internal/model/entity"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

type CourseInfo struct {
	CourseId    int64       `json:"courseId" dc:"id of this course"`
	TeacherId   int64       `json:"teacherId" dc:"id of teacher"`
	CourseName  string      `json:"courseName" dc:"name of this course"`
	Description string      `json:"description" dc:"description of this course"`
	StartTime   *gtime.Time `json:"startTime" dc:"start time of this course"`
	EndTime     *gtime.Time `json:"endTime" dc:"end time of this course"`
}

type CourseInfoWithLecture struct {
	CourseId    int64              `json:"courseId" dc:"id of this course"`
	TeacherId   int64              `json:"teacherId" dc:"id of teacher"`
	CourseName  string             `json:"courseName" dc:"name of this course"`
	Description string             `json:"description" dc:"description of this course"`
	StartTime   *gtime.Time        `json:"startTime" dc:"start time of this course"`
	EndTime     *gtime.Time        `json:"endTime" dc:"end time of this course"`
	Lectures    []*entity.Lectures `json:"lectures" dc:"lectures of this course"`
}

// 获取课程信息的requset
type GetAllCoursesInfoReq struct {
	g.Meta `path:"/api/course/getCourses" method:"get" tags:"Course" summary:"get info of all courses"`
}

// 获取课程信息的response
type GetAllCoursesInfoRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Courses []*entity.Courses `json:"courses" dc:"Info of all courses"`
}

type CreateCourseReq struct {
	g.Meta    `path:"/api/course/createCourse" method:"post" tags:"Course" summary:"create course"`
	NewCourse CourseInfo `json:"course" dc:"Info of the course to create"`
}

type CreateCourseRes struct {
	g.Meta   `mime:"text/html" example:"json"`
	CourseId int64 `json:"courseId" dc:"id of the new course"`
}

type GetCourseWithLecturesByCourseIdReq struct {
	g.Meta   `path:"/api/course/searchCourseWithLectures/{courseId}" method:"get" tags:"Course" summary:"get course info and lectures with courseId"`
	CourseId int64 `v:"required" dc:"id of the course to find"`
}

type GetCourseWithLecturesByCourseIdRes struct {
	g.Meta `mime:"text/html" example:"json"`
	Course CourseInfoWithLecture `json:"course" dc:"info of the course"`
}

type GetCourseWithLecturesByStudentIdReq struct {
	g.Meta `path:"/api/course/searchCourseWithLectures/byStudentId" method:"get" tags:"Course" summary:"get courses info and lectures info of a user"`
}

type GetCourseWithLecturesByStudentIdRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Courses []CourseInfoWithLecture `json:"courses" dc:"info of the courses"`
}

type GetCourseReq struct {
	g.Meta   `path:"/api/course/searchCourse/{courseId}" method:"get" tags:"Course" summary:"get course info"`
	CourseId int64 `v:"required" dc:"id of the course to find"`
}

type GetCourseRes struct {
	g.Meta `mime:"text/html" example:"json"`
	Course *entity.Courses `json:"course" dc:"info of the course"`
}

type DeleteCourseReq struct {
	g.Meta   `path:"/api/course/deleteCourse" method:"delete" tags:"Course" summary:"delete course info"`
	CourseId int64 `v:"required" dc:"id of the course to delete"`
}

type DeleteCourseRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"success or not"`
}

type UpdateCourseReq struct {
	g.Meta       `path:"/api/course/updateCourse" method:"put" tags:"Course" summary:"update course"`
	UpdateCourse CourseInfo `json:"course" dc:"Info of the course to update"`
}

type UpdateCourseRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"success or not"`
}

type AssignCourseAssistantReq struct {
	g.Meta      `path:"/api/course/assignCourseAssistant" method:"post" tags:"Course" summary:"assign course assistant"`
	CourseId    int64 `json:"courseId" dc:"Id of the course"`
	AssistantId int64 `json:"assistantId" v:"required" dc:"id of the user who will be the assistant"`
}

type AssignCourseAssistantRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"success or not"`
}

type UnassignCourseAssistantReq struct {
	g.Meta      `path:"/api/course/unassignCourseAssistant" method:"delete" tags:"Course" summary:"unassign course assistant"`
	CourseId    int64 `json:"courseId" dc:"Id of the course"`
	AssistantId int64 `json:"assistantId" v:"required" dc:"id of the user who will not be the assistant any more"`
}

type UnassignCourseAssistantRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"success or not"`
}
