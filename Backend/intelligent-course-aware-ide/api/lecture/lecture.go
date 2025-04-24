// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package lecture

import (
	"context"

	"intelligent-course-aware-ide/api/lecture/v1"
)

type ILectureV1 interface {
	GetAllLectureOfACourseInfo(ctx context.Context, req *v1.GetAllLectureOfACourseInfoReq) (res *v1.GetAllLectureOfACourseInfoRes, err error)
	CreateLecture(ctx context.Context, req *v1.CreateLectureReq) (res *v1.CreateLectureRes, err error)
	GetLecture(ctx context.Context, req *v1.GetLectureReq) (res *v1.GetLectureRes, err error)
	DeleteLecture(ctx context.Context, req *v1.DeleteLectureReq) (res *v1.DeleteLectureRes, err error)
	UpdateLecture(ctx context.Context, req *v1.UpdateLectureReq) (res *v1.UpdateLectureRes, err error)
}
