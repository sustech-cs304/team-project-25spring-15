package v1

import (
	"github.com/gogf/gf/v2/frame/g"
	"intelligent-course-aware-ide/internal/model/entity"
)
type CommentInfo struct{
	CommentId int64 `json:"id" dc:"Id of the comment"`
	LectureId int64 `json:"lectureId" dc:"Id of the lecture the comment in"`
	AuthorId int64 `json:"authorId" dc:"Id of the commented user"`
	RepliedToCommentId int64 `json:"repliedtocommentId" dc:"Id of the commenting user"`
	Content string `json:"content" dc:"content of the comment"`
	CreateTime string `json:"createTime" dc:" createTime of the comment"`
	Likes int64 `json:"likes" dc:"The number of likes"`
}
type CreateCommentReq struct{
	g.Meta `path:"/api/comment/createComment" method:"post" tags:"Comment" summary:"Create comment"`
	NewComment CommentInfo `json:"comment" dc:"Info of the comment"`
}
type CreateCommentRes struct{
	g.Meta `mime:"text/html" example:"json"`
	CommentId int64 `json:"CommentId" dc:"Id of the created comment"`
}
type GetCommentReq struct{
	g.Meta `path:"/api/comment/getComment/{lectureId}" method:"get" tags:"Comment" summary:"Get comment"`
	LectureId int64 `json:"LectureId" dc:"Id of the required lecture"`
}
type GetCommentRes struct{
	g.Meta `mime:"text/html" example:"json"`
	Comments []*entity.Comment `json:"comment" dc:"info of the comment"`
}
type DeleteCommentReq struct {
	g.Meta   `path:"/api/comment/deleteComment" method:"delete" tags:"Comment" summary:"delete comment info"`
	CommentId int64 `v:"required" dc:"id of the comment to delete"`
	UserId   int64 `json:"userId" v:"required" dc:"id of the user who want to delete this comment"`
}

type DeleteCommentRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"success or not"`
}
type UpdateCommentReq struct{
	g.Meta `path:"/api/comment/updateComment" method:"put" tags:"Comment" summary:"update the comment(mainly likes) info"`
	UserId int64 `json:"userId" v:"required" dc:"id of the user who want to update"`
	CommentId int64 `json:"commentId" v:"required" dc:"id of the comment to update"`
	Likes int64 `json:"likes" v:"required" dc:"the number of new likes"`
}
type UpdateCommentRes struct{
	g.Meta `mime:"text/html" example:"json"`
	Success bool  `json:"success" dc:"success or not"`
}