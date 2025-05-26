package v1

import (
	"github.com/gogf/gf/v2/frame/g"
)

type CommentInfo struct {
	CommentId          int64  `json:"id" dc:"Id of the comment"`
	LectureId          int64  `json:"lectureId" dc:"Id of the lecture the comment in"`
	AuthorId           int64  `json:"authorId" dc:"Id of the commented user"`
	AuthorName         string `json:"authorName" dc:"Name of the comment user"`
	RepliedToCommentId int64  `json:"repliedTocommentId" dc:"Id of the commented comment"`
	RepliedToUserName  string `json:"repliedToUserName" dc:"Name of the commented user"`
	Content            string `json:"content" dc:"content of the comment"`
	CreateTime         string `json:"createTime" dc:" createTime of the comment"`
	Likes              int64  `json:"likes" dc:"The number of likes"`
}
type CreateCommentReq struct {
	g.Meta     `path:"/api/comment/createComment" method:"post" tags:"Comment" summary:"Create comment"`
	NewComment CommentInfo `json:"comment" dc:"Info of the comment"`
}
type CreateCommentRes struct {
	g.Meta    `mime:"text/html" example:"json"`
	CommentId int64 `json:"CommentId" dc:"Id of the created comment"`
}
type GetCommentReq struct {
	g.Meta    `path:"/api/comment/getComment/{lectureId}" method:"get" tags:"Comment" summary:"Get comment"`
	LectureId int64 `json:"LectureId" dc:"Id of the required lecture"`
}
type GetCommentRes struct {
	g.Meta   `mime:"text/html" example:"json"`
	Comments []*CommentInfo `json:"comment" dc:"info of the comment"`
}
type DeleteCommentReq struct {
	g.Meta    `path:"/api/comment/deleteComment" method:"delete" tags:"Comment" summary:"delete comment info"`
	CommentId int64 `v:"required" dc:"id of the comment to delete"`
	UserId    int64 `json:"userId" v:"required" dc:"id of the user who want to delete this comment"`
}

type DeleteCommentRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"success or not"`
}
type UpdateCommentReq struct {
	g.Meta    `path:"/api/comment/updateComment" method:"put" tags:"Comment" summary:"update the comment(mainly likes) info"`
	UserId    int64 `json:"userId" v:"required" dc:"id of the user who want to update"`
	CommentId int64 `json:"commentId" v:"required" dc:"id of the comment to update"`
	Likes     int64 `json:"likes" v:"required" dc:"the number of new likes"`
}
type UpdateCommentRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"success or not"`
}
type GetHotWordsReq struct {
	g.Meta    `path:"/api/comment/getHotWords/{lectureId}" method:"get" tags:"Comment" summary:"Get high frequency words from comments"`
	LectureId int64 `json:"lectureId" dc:"Lecture ID"`
}
type HotWord struct {
	Word  string `json:"word" dc:"High frequency word"`
	Count int    `json:"count" dc:"Word count"`
}
type GetHotWordsRes struct {
	g.Meta `mime:"text/json" example:"json"`
	List   []*HotWord `json:"list" dc:"List of hot words"`
}
