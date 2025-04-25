// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package Files

import (
	"context"

	"intelligent-course-aware-ide/api/Files/v1"
)

type IFilesV1 interface {
	UploadLectureFile(ctx context.Context, req *v1.UploadLectureFileReq) (res *v1.UploadLectureFileRes, err error)
	UpdateLectureFile(ctx context.Context, req *v1.UpdateLectureFileReq) (res *v1.UpdateLectureFileRes, err error)
	DeleteLectureFile(ctx context.Context, req *v1.DeleteLectureFileReq) (res *v1.DeleteLectureFileRes, err error)
	GetLectureFile(ctx context.Context, req *v1.GetLectureFileReq) (res interface{}, err error)
}
