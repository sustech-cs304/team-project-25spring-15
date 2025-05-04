// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
)

// Comment is the golang structure of table Comment for DAO operations like Where/Data.
type Comment struct {
	g.Meta             `orm:"table:Comment, do:true"`
	CommentId          interface{} //
	BeingCommentedUser interface{} //
	LectureId          interface{} //
	CommentUser        interface{} //
	Content            interface{} //
	CreateTime         interface{} //
}
