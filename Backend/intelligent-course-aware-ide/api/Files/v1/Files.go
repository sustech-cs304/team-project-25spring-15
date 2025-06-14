package v1

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
)

type UploadFileReq struct {
	g.Meta `path:"/api/Files" method:"post" tags:"file" summary:"upload a file and return a generated fileId, without doing anything else"`
	File   *ghttp.UploadFile `p:"file" v:"required"`
}

type UploadFileRes struct {
	FileId int64 `p:"fileId" dc:"file id genrating by uploading a file without doing anything else"`
}

type UploadLectureFileReq struct {
	g.Meta    `path:"/api/Files/lectureFile/upload" method:"post" tags:"file" summary:"upload lectureFile"`
	LectureId int64             `p:"lectureId" v:"required"`
	File      *ghttp.UploadFile `p:"file" v:"required"`
}

type UploadLectureFileRes struct {
	Result bool  `json:"result" dc:"is OK or not"`
	FileId int64 `json:"fileId" dc:"file id"`
}

type UploadLectureNoteReq struct {
	g.Meta    `path:"/api/Files/lectureNote/upload" method:"post" tags:"file" summary:"upload lectureNote"`
	LectureId int64             `p:"lectureId" v:"required"`
	File      *ghttp.UploadFile `p:"file" v:"required"`
}

type UploadLectureNoteRes struct {
	Result bool  `json:"result" dc:"is OK or not"`
	FileId int64 `json:"fileId" dc:"file id"`
}

type UpdateLectureFileReq struct {
	g.Meta `path:"/api/Files/lectureFile/{FileId}" method:"put" tags:"file" summary:"update a lectureFile"`
	FileId int64             `v:"required" dc:"file id"`
	File   *ghttp.UploadFile `p:"file" v:"required"`
}

type UpdateLectureFileRes struct {
	Result bool  `json:"result" dc:"is OK or not"`
	FileId int64 `json:"fileId" dc:"file id"`
}

type DeleteLectureFileReq struct {
	g.Meta `path:"/api/Files/lectureFile/{FileId}" method:"delete" tags:"file" summary:"delete lecture File"`
	FileId int64 `v:"required" dc:"an unique file id"`
}

type DeleteLectureFileRes struct {
	Result bool `json:"result" dc:"is OK or not"`
}

type DeleteLectureNoteReq struct {
	g.Meta `path:"/api/Files/lectureNote/{FileId}" method:"delete" tags:"file" summary:"delete lecture File"`
	FileId int64 `v:"required" dc:"an unique file id"`
}

type DeleteLectureNoteRes struct {
	Result bool `json:"result" dc:"is OK or not"`
}

type GetLectureFileReq struct {
	g.Meta `path:"/api/Files/lectureFile/file/{FileId}" method:"get" tags:"file" summary:"get lecture File"`
	FileId int64 `v:"required" dc:"an unique file id"`
}

type GetLectureFileRes struct {
}

type GetFileWithLectureIdReq struct {
	g.Meta    `path:"/api/Files/lectureFile/lecture/{LectureId}" method:"get" tags:"file" summary:"get lecture File"`
	LectureId int64 `v:"required" dc:"an unique lecture id"`
}

type GetFileWithLectureIdRes struct {
}

type GetNoteWithLectureIdReq struct {
	g.Meta    `path:"/api/Files/lectureNote/lecture/{LectureId}" method:"get" tags:"file" summary:"get lecture File"`
	LectureId int64 `v:"required" dc:"an unique lecture id"`
}

type GetNoteWithLectureIdRes struct {
}
