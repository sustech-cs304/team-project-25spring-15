// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package account

import (
	"context"

	"intelligent-course-aware-ide/api/account/v1"
)

type IAccountV1 interface {
	LoginUser(ctx context.Context, req *v1.LoginUserReq) (res *v1.LoginUserRes, err error)
	CreateUser(ctx context.Context, req *v1.CreateUserReq) (res *v1.CreateUserRes, err error)
}
