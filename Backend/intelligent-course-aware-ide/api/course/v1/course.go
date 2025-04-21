package v1

import (
	"intelligent-course-aware-ide/internal/model/entity"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

type CourseInfo struct {
	CourseId    int64       `json:"courseId" dc:"id of this course"`
	CourseName  string      `json:"courseName" dc:"name of this course"`
	Description string      `json:"description" dc:"description of this course"`
	StartTime   *gtime.Time `json:"startTime" dc:"start time of this course"`
	EndTime     *gtime.Time `json:"endTime" dc:"end time of this course"`
}

// 获取课程信息的requset
type GetAllCoursesInfoReq struct {
	g.Meta `path:"/api/getCourses" method:"get" tags:"Course" summary:"get info of all course"`
}

// 获取课程信息的response
type GetAllCoursesInfoRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Courses []*entity.Courses `json:"courses" dc:"Info of all courses"`
}

type CreateCourseReq struct {
	g.Meta    `path:"/api/createCourse" method:"post" tags:"Course" summary:"create course"`
	NewCourse CourseInfo `json:"course" dc:"Info of the course to create"`
}

type CreateCourseRes struct {
	g.Meta   `mime:"text/html" example:"json"`
	CourseId int64 `json:"courseId" dc:"id of the new course"`
}

type GetCourseReq struct {
	g.Meta   `path:"/api/searchCourse/{courseId}" method:"get" tags:"Course" summary:"get course info"`
	CourseId int64 `v:"required" dc:"id of the course to find"`
}

type GetCourseRes struct {
	g.Meta `mime:"text/html" example:"json"`
	Course *entity.Courses `json:"course" dc:"info of the course"`
}

type DeleteCourseReq struct {
	g.Meta   `path:"/api/deleteCourse/{courseId}" method:"delete" tags:"Course" summary:"delete course info"`
	CourseId int64 `v:"required" dc:"id of the course to delete"`
	UserId   int64 `json:"userId" v:"required" dc:"id of the user who want to delete this course"`
}

type DeleteCourseRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"success or not"`
}

type UpdateCourseReq struct {
	g.Meta    `path:"/api/createCourse" method:"put" tags:"Course" summary:"create course"`
	NewCourse *entity.Courses `json:"course" dc:"Info of the course to create"`
}

type UpdateCourseRes struct {
	g.Meta    `mime:"text/html" example:"json"`
	NewCourse *entity.Courses `json:"course" dc:"info of the new course"`
}
