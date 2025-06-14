package v1

import (
	"intelligent-course-aware-ide/internal/model/entity"

	userv1 "intelligent-course-aware-ide/api/user/v1"

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
	ChatId      int64       `json:"chatId" dc:"chat id of this course"`
}

type CourseInfoWithLecture struct {
	CourseId    int64              `json:"courseId" dc:"id of this course"`
	TeacherId   int64              `json:"teacherId" dc:"id of teacher"`
	CourseName  string             `json:"courseName" dc:"name of this course"`
	Description string             `json:"description" dc:"description of this course"`
	StartTime   *gtime.Time        `json:"startTime" dc:"start time of this course"`
	EndTime     *gtime.Time        `json:"endTime" dc:"end time of this course"`
	ChatId      int64              `json:"chatId" dc:"chat id of this course"`
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

type SearchCourseReq struct {
	g.Meta       `path:"/api/course/searchCourses" method:"get" tags:"Course" summary:"search courses with keyword"`
	Keywords     string `json:"keywords" dc:"keywords of this search"`
	SourceTable  string `json:"kind" dc:"which kind of info will be included this search"`
	RecommendNum int    `json:"recommendNum" dc:"number of the result to show"`
}

type SearchCourseRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Courses []*entity.FuzzySearchAdv `json:"courses" dc:"Info of all courses"`
}

type RecommendCourseReq struct {
	g.Meta `path:"/api/course/recommendCourses" method:"get" tags:"Course" summary:"recommend courses"`
}

type RecommendCourseRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Courses []*entity.FuzzySearchAdv `json:"courses" dc:"Info of all courses"`
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
	g.Meta         `mime:"text/html" example:"json"`
	Course         CourseInfoWithLecture `json:"course" dc:"info of the course"`
	CourseIdentity string                `json:"courseIdentity" dc:"identity of the user in this course"`
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

type ApplyToJoinCourseReq struct {
	g.Meta          `path:"/api/course/applyToJoinCourse" method:"post" tags:"Course" summary:"student apply to join in the course"`
	CourseId        int64  `json:"courseId" dc:"Id of the course"`
	ApplicationInfo string `json:"applicationInfo" dc:"Info of this application"`
}

type ApplyToJoinCourseRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"success or not(attention here: this success does not mean the student has join in the course, he has to wait for teacher or superuser to review this aplication)"`
}

type AddStudentsIntoCourseReq struct {
	g.Meta        `path:"/api/course/addStudents" method:"post" tags:"Course" summary:"add students into the course"`
	CourseId      int64    `json:"courseId" dc:"Id of the course"`
	StudentsEmail []string `json:"studentsEmail" dc:"Email of students to add into the course"`
}

type AddStudentsIntoCourseRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"success or not"`
}

type GetAllStudentsOfACourseReq struct {
	g.Meta   `path:"/api/course/getAllStudentsOfACourse/{courseId}" method:"get" tags:"Course" summary:"get all students in the course"`
	CourseId int64 `json:"courseId" dc:"Id of the course"`
}

type GetAllStudentsOfACourseRes struct {
	g.Meta   `mime:"text/html" example:"json"`
	Students []userv1.UserInfoWithoutPassword `json:"students" dc:"info of students in the course"`
}
