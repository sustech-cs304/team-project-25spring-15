package v1

import (
	"github.com/gogf/gf/v2/frame/g"
)

type CourseInfo struct {
	CourseId   int64          `json:"id" dc:"Id of the course"`
	CourseName string         `json:"title" dc:"Name of the course"`
	Lectures   []LecutureInfo `json:"lectures" dc:"Lectures of this course"`
}

type LecutureInfo struct {
	Test_1 int `json:"test" dc:"test"`
}

type GetAllCoursesInfoReq struct {
	g.Meta `path:"/course/all" method:"get" tags:"Course" summary:"get info of all course"`
}

type GetAllCoursesInfoRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Courses []CourseInfo `json:"courses" dc:"Info of all courses"`
}
