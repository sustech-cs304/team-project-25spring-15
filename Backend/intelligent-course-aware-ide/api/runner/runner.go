// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package runner

import (
	"context"

	"intelligent-course-aware-ide/api/runner/v1"
)

type IRunnerV1 interface {
	GeneralRunner(ctx context.Context, req *v1.GeneralRunnerReq) (res *v1.GeneralRunnerRes, err error)
}
