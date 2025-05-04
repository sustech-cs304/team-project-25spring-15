// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

// Comment is the golang structure for table Comment.
type Comment struct {
	CommentId          int64  `json:"commentId"          orm:"commentId"          description:""` //
	BeingCommentedUser int64  `json:"beingCommentedUser" orm:"beingCommentedUser" description:""` //
	LectureId          int64  `json:"lectureId"          orm:"lectureId"          description:""` //
	CommentUser        int64  `json:"commentUser"        orm:"commentUser"        description:""` //
	Content            string `json:"content"            orm:"content"            description:""` //
	CreateTime         string `json:"createTime"         orm:"createTime"         description:""` //
}
