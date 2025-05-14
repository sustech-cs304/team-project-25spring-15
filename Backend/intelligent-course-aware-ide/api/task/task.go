// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package task

import (
	"context"

	"intelligent-course-aware-ide/api/task/v1"
)

type ITaskV1 interface {
	GetAllTaskInfoWithUserId(ctx context.Context, req *v1.GetAllTaskInfoWithUserIdReq) (res *v1.GetAllTaskInfoWithUserIdRes, err error)
}
