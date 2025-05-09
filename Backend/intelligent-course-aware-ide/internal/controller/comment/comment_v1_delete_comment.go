package comment

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/comment/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) DeleteComment(ctx context.Context, req *v1.DeleteCommentReq) (res *v1.DeleteCommentRes, err error) {
	result, err := CheckUserHasPermissionOfComment(ctx, req.UserId, req.CommentId)
	if err != nil {
		res = &v1.DeleteCommentRes{
			Success: false,
		}
		return res, err
	}
	if result {
		_, err = dao.Comment.Ctx(ctx).WherePri(req.CommentId).Delete()
		if err != nil {
			return nil, err
		}
		res = &v1.DeleteCommentRes{
			Success: true,
		}
		return res, nil
	} else {
		res = &v1.DeleteCommentRes{
			Success: false,
		}
		err = errors.New("user has no permission of this comment")
		return res, err
	}
}
