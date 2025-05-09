package comment

import (
	"context"

	v1 "intelligent-course-aware-ide/api/comment/v1"
	"intelligent-course-aware-ide/internal/dao"

	"github.com/gogf/gf/frame/g"
)

func (c *ControllerV1) UpdateComment(ctx context.Context, req *v1.UpdateCommentReq) (res *v1.UpdateCommentRes, err error) {
	res = &v1.UpdateCommentRes{
		Success: false,
	}
	_, err = dao.Comment.Ctx(ctx).Data(g.Map{
		"likes": req.Likes,
	}).Where("commentId", req.CommentId).Update()
	if err != nil {
		return res, err
	}
	res.Success = true
	return res, nil
}
