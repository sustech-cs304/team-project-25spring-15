// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package user

import (
	"context"

	"intelligent-course-aware-ide/api/user/v1"
)

type IUserV1 interface {
	GetAllUsersInfo(ctx context.Context, req *v1.GetAllUsersInfoReq) (res *v1.GetAllUsersInfoRes, err error)
	GetUser(ctx context.Context, req *v1.GetUserReq) (res *v1.GetUserRes, err error)
	DeleteUser(ctx context.Context, req *v1.DeleteUserReq) (res *v1.DeleteUserRes, err error)
	UpdateUser(ctx context.Context, req *v1.UpdateUserReq) (res *v1.UpdateUserRes, err error)
	LogoutUser(ctx context.Context, req *v1.LogoutUserReq) (res *v1.LogoutUserRes, err error)
}
