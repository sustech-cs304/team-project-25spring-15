package comment

import (
	"context"

	v1 "intelligent-course-aware-ide/api/comment/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/do"
)

func (c *ControllerV1) CreateComment(ctx context.Context, req *v1.CreateCommentReq) (res *v1.CreateCommentRes, err error) {
	commentId, err := dao.Comment.Ctx(ctx).Data(do.Comment{
		LectureId:          req.NewComment.LectureId,
		AuthorId:           req.NewComment.AuthorId,
		RepliedToCommentId: req.NewComment.RepliedToCommentId,
		Content:            req.NewComment.Content,
		CreateTime:         req.NewComment.CreateTime,
		Likes:              req.NewComment.Likes,
	}).InsertAndGetId()
	if err != nil {
		return nil, err
	}
	res = &v1.CreateCommentRes{
		CommentId: commentId,
	}
	return res, nil
}
