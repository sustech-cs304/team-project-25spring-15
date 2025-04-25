package v1

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
)

type UploadLectureFileReq struct {
	g.Meta    `path:"/api/Files/courseFile/upload" method:"post" tags:"file" summary:"upload CourseFile"`
	CourseId  int64             `v:"required" json:"courseId"`
	LectureId int64             `v:"required" json:"lectureId"`
	Index     int64             `v:"required" json:"index" dc:"the index of this file in this lecture"`
	File      *ghttp.UploadFile `v:"required" json:"file"`
}

type CoverLectureFileReq struct {
	g.Meta    `path:"/api/Files/courseFile/cover" method:"post" tags:"file" summary:"cover a CourseFile"`
	CourseId  int64             `v:"required" json:"courseId"`
	LectureId int64             `v:"required" json:"lectureId"`
	Index     int64             `v:"required" json:"index" dc:"the index of this file in this lecture"`
	File      *ghttp.UploadFile `v:"required" json:"file"`
}

type DeleteLectureFileReq struct {
	g.Meta `path:"/api/Files/courseFile/delete" method:"post" tags:"file" summary:"delete CourseFile"`
	FileId uint `v:"required" dc:"an unique file id"`
}

type UploadLectureFileRes struct {
	Result bool  `json:"result" dc:"is OK or not"`
	Id     int64 `json:"id" dc:"file id"`
}

type CoverLectureFileRes struct {
	Result bool  `json:"result" dc:"is OK or not"`
	Id     int64 `json:"id" dc:"file id"`
}

type DeleteLectureFileRes struct {
	Result bool `json:"result" dc:"is OK or not"`
}
