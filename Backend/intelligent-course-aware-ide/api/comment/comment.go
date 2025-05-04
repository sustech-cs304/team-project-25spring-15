// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package comment

import (
	"context"

	V1 "intelligent-course-aware-ide/api/comment/V1"
)

type ICommentV1 interface {
	CreateComment(ctx context.Context, req *V1.CreateCommentReq) (res *V1.CreateCommentRes, err error)
	GetComment(ctx context.Context, req *V1.GetCommentReq) (res *V1.GetCommentRes, err error)
	DeleteComment(ctx context.Context, req *V1.DeleteCommentReq) (res *V1.DeleteCommentRes, err error)
}
