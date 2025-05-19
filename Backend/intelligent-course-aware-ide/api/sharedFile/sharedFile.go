// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package sharedFile

import (
	"context"

	"intelligent-course-aware-ide/api/sharedFile/v1"
)

type ISharedFileV1 interface {
	CreateSharedFile(ctx context.Context, req *v1.CreateSharedFileReq) (res *v1.CreateSharedFileRes, err error)
	SharedFileUserGetIn(ctx context.Context, req *v1.SharedFileUserGetInReq) (res *v1.SharedFileUserGetInRes, err error)
	SharedFileUserGetOut(ctx context.Context, req *v1.SharedFileUserGetOutReq) (res *v1.SharedFileUserGetOutRes, err error)
	UpdateSharedFile(ctx context.Context, req *v1.UpdateSharedFileReq) (res *v1.UpdateSharedFileRes, err error)
	ConnectSharedFile(ctx context.Context, req *v1.ConnectSharedFileReq) (res *v1.ConnectSharedFileRes, err error)
	GetSharedFileContent(ctx context.Context, req *v1.GetSharedFileContentReq) (res *v1.GetSharedFileContentRes, err error)
}
