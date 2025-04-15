// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

// Comments is the golang structure for table Comments.
type Comments struct {
	CommentId       int    `json:"commentId"       orm:"commentId"       description:""` //
	FatherCommentId int    `json:"fatherCommentId" orm:"fatherCommentId" description:""` //
	SubCommentId    int    `json:"subCommentId"    orm:"subCommentId"    description:""` //
	CourseId        int64  `json:"courseId"        orm:"courseId"        description:""` //
	LectureId       int    `json:"lectureId"       orm:"lectureId"       description:""` //
	PublisherId     int64  `json:"publisherId"     orm:"publisherId"     description:""` //
	CommentC        string `json:"commentC"        orm:"comment_C"       description:""` //
}
