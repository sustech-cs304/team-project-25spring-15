// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
)

// Comments is the golang structure of table Comments for DAO operations like Where/Data.
type Comments struct {
	g.Meta          `orm:"table:Comments, do:true"`
	CommentId       interface{} //
	FatherCommentId interface{} //
	SubCommentId    interface{} //
	CourseId        interface{} //
	LectureId       interface{} //
	PublisherId     interface{} //
	Comment         interface{} //
}
