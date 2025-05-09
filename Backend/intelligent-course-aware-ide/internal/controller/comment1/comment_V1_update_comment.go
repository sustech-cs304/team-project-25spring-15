package comment

import (
	"context"
	"github.com/gogf/gf/v2/frame/g"

	"intelligent-course-aware-ide/api/comment/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) UpdateComment(ctx context.Context, req *v1.UpdateCommentReq) (res *v1.UpdateCommentRes, err error) {
	res = &v1.UpdateCommentRes{
		Success: false,
	}
	_,err = dao.Comment.Ctx(ctx).Data(g.Map{
		"likes":req.Likes,
	}).Where("commentId",req.CommentId).Update()
	if err != nil {
		return res,err
	}
	res.Success = true
	return res, nil 
}
