// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package course

import (
	"context"

	"intelligent-course-aware-ide/api/course/v1"
)

type ICourseV1 interface {
	GetAllCoursesInfo(ctx context.Context, req *v1.GetAllCoursesInfoReq) (res *v1.GetAllCoursesInfoRes, err error)
	CreateCourse(ctx context.Context, req *v1.CreateCourseReq) (res *v1.CreateCourseRes, err error)
	GetCourse(ctx context.Context, req *v1.GetCourseReq) (res *v1.GetCourseRes, err error)
	DeleteCourse(ctx context.Context, req *v1.DeleteCourseReq) (res *v1.DeleteCourseRes, err error)
	UpdateCourse(ctx context.Context, req *v1.UpdateCourseReq) (res *v1.UpdateCourseRes, err error)
}
