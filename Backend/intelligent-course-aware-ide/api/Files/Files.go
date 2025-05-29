// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package Files

import (
	"context"

	"intelligent-course-aware-ide/api/Files/v1"
)

type IFilesV1 interface {
	UploadFile(ctx context.Context, req *v1.UploadFileReq) (res *v1.UploadFileRes, err error)
	UploadLectureFile(ctx context.Context, req *v1.UploadLectureFileReq) (res *v1.UploadLectureFileRes, err error)
	UploadLectureNote(ctx context.Context, req *v1.UploadLectureNoteReq) (res *v1.UploadLectureNoteRes, err error)
	UpdateLectureFile(ctx context.Context, req *v1.UpdateLectureFileReq) (res *v1.UpdateLectureFileRes, err error)
	DeleteLectureFile(ctx context.Context, req *v1.DeleteLectureFileReq) (res *v1.DeleteLectureFileRes, err error)
	DeleteLectureNote(ctx context.Context, req *v1.DeleteLectureNoteReq) (res *v1.DeleteLectureNoteRes, err error)
	GetLectureFile(ctx context.Context, req *v1.GetLectureFileReq) (res *v1.GetLectureFileRes, err error)
	GetFileWithLectureId(ctx context.Context, req *v1.GetFileWithLectureIdReq) (res *v1.GetFileWithLectureIdRes, err error)
	GetNoteWithLectureId(ctx context.Context, req *v1.GetNoteWithLectureIdReq) (res *v1.GetNoteWithLectureIdRes, err error)
}
