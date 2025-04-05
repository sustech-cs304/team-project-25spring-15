// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package runner

import (
	"context"

	"intelligent-course-aware-ide/api/runner/v1"
)

type IRunnerV1 interface {
	PythonRunner(ctx context.Context, req *v1.PythonRunnerReq) (res *v1.PythonRunnerRes, err error)
	CRunner(ctx context.Context, req *v1.CRunnerReq) (res *v1.CRunnerRes, err error)
}
