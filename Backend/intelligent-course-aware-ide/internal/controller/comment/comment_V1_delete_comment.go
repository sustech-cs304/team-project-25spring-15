package comment

import (
	"context"

	V1 "intelligent-course-aware-ide/api/comment/V1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) DeleteComment(ctx context.Context, req *V1.DeleteCommentReq) (res *V1.DeleteCommentRes, err error) {
	_,err = dao.Comment.Ctx(ctx).WherePri(req.CommentId).Delete()
	return
}
