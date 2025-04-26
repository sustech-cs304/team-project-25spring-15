package v1

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
)

type UploadLectureFileReq struct {
	g.Meta    `path:"/api/Files/lectureFile/upload" method:"post" tags:"file" summary:"upload lectureFile"`
	LectureId int64             `v:"required" json:"lectureId"`
	File      *ghttp.UploadFile `v:"required" json:"file"`
}

type UpdateLectureFileReq struct {
	g.Meta `path:"/api/Files/lectureFile/{FileId}" method:"put" tags:"file" summary:"update a lectureFile"`
	FileId int64             `v:"required" dc:"file id"`
	File   *ghttp.UploadFile `v:"required" json:"file"`
}

type DeleteLectureFileReq struct {
	g.Meta `path:"/api/Files/lectureFile/{FileId}" method:"delete" tags:"file" summary:"delete lecture File"`
	FileId int64 `v:"required" dc:"an unique file id"`
}

type GetLectureFileReq struct {
	g.Meta `path:"/api/Files/lectureFile/{FileId}" method:"get" tags:"file" summary:"get lecture File"`
	FileId int64 `v:"required" dc:"an unique file id"`
}

type UploadLectureFileRes struct {
	Result bool  `json:"result" dc:"is OK or not"`
	FileId int64 `json:"id" dc:"file id"`
}

type UpdateLectureFileRes struct {
	Result bool  `json:"result" dc:"is OK or not"`
	FileId int64 `json:"id" dc:"file id"`
}

type DeleteLectureFileRes struct {
	Result bool `json:"result" dc:"is OK or not"`
}

type GetLectureFileRes struct {
}
