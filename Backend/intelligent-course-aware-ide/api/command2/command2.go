// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package command2

import (
	"context"

	"intelligent-course-aware-ide/api/command2/v1"
)

type ICommand2V1 interface {
	CreateShell(ctx context.Context, req *v1.CreateShellReq) (res *v1.CreateShellRes, err error)
	ExecCommand(ctx context.Context, req *v1.ExecCommandReq) (res *v1.ExecCommandRes, err error)
	CloseShell(ctx context.Context, req *v1.CloseShellReq) (res *v1.CloseShellRes, err error)
}
