// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package comment

import (
	"context"

	"intelligent-course-aware-ide/api/comment/v1"
)

type ICommentV1 interface {
	CreateComment(ctx context.Context, req *v1.CreateCommentReq) (res *v1.CreateCommentRes, err error)
	GetComment(ctx context.Context, req *v1.GetCommentReq) (res *v1.GetCommentRes, err error)
	DeleteComment(ctx context.Context, req *v1.DeleteCommentReq) (res *v1.DeleteCommentRes, err error)
	UpdateComment(ctx context.Context, req *v1.UpdateCommentReq) (res *v1.UpdateCommentRes, err error)
}
