package v1

import (
	"github.com/gogf/gf/v2/frame/g"
)

type CourseInfo struct {
	CourseId          int64         `json:"id" dc:"Id of the course"`
	CourseName        string        `json:"title" dc:"Name of the course"`
	CourseDescription string        `json:"description" dc:"description of the course"`
	Lectures          []LectureInfo `json:"lectures" dc:"Lectures of this course"`
}

type LectureInfo struct {
	LectureId         int64  `json:"id" dc:"Id of the lecture"`
	LecutureName      string `json:"title" dc:"Name of the lecture"`
	CourseDescription string `json:"description" dc:"description of the lecture"`
}

type GetAllCoursesInfoReq struct {
	g.Meta `path:"/api/getCourses" method:"get" tags:"Course" summary:"get info of all course"`
}

type GetAllCoursesInfoRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Courses []CourseInfo `json:"courses" dc:"Info of all courses"`
}
