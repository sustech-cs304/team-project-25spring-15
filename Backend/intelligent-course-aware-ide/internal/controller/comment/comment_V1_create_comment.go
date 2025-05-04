package comment

import (
	"context"

	V1 "intelligent-course-aware-ide/api/comment/V1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/do"
)

func (c *ControllerV1) CreateComment(ctx context.Context, req *V1.CreateCommentReq) (res *V1.CreateCommentRes, err error) {
	commentId,err := dao.Comment.Ctx(ctx).Data(do.Comment{
		LectureId: req.NewComment.LectureId,
		CommentUser: req.NewComment.CommentingUser,
		BeingCommentedUser: req.NewComment.CommentedUser,
		Content: req.NewComment.Content,
		CreateTime: req.NewComment.CreateTime,
	}).InsertAndGetId()
	if err != nil{
		return nil,err
	}
	res = &V1.CreateCommentRes{
		CommentId: commentId,
	}
	return res,nil
}
