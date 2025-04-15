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
}
