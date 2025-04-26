// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
)

// AssignmentUserFeedback is the golang structure of table AssignmentUserFeedback for DAO operations like Where/Data.
type AssignmentUserFeedback struct {
	g.Meta       `orm:"table:AssignmentUserFeedback, do:true"`
	AssignmentId interface{} //
	PerformerId  interface{} //
	Score        interface{} //
	FileId       interface{} //
	FileType     interface{} //
}
