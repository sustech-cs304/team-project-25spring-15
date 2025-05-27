// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

// Comment is the golang structure for table Comment.
type Comment struct {
	CommentId          int64  `json:"commentId"          orm:"commentId"          description:""` //
	RepliedToCommentId int64  `json:"repliedToCommentId" orm:"repliedToCommentId" description:""` //
	LectureId          int64  `json:"lectureId"          orm:"lectureId"          description:""` //
	AuthorId           int64  `json:"authorId"           orm:"authorId"           description:""` //
	Content            string `json:"content"            orm:"content"            description:""` //
	CreateTime         string `json:"createTime"         orm:"createTime"         description:""` //
	Likes              int64  `json:"likes"              orm:"likes"              description:""` //
}
