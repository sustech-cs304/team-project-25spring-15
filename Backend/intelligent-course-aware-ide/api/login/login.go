// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package login

import (
	"context"

	"intelligent-course-aware-ide/api/login/v1"
)

type ILoginV1 interface {
	LoginUser(ctx context.Context, req *v1.LoginUserReq) (res *v1.LoginUserRes, err error)
}
