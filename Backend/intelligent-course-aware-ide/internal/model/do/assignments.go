// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// Assignments is the golang structure of table assignments for DAO operations like Where/Data.
type Assignments struct {
	g.Meta       `orm:"table:assignments, do:true"`
	AssignmentId interface{} //
	OwnerId      interface{} //
	CourseId     interface{} //
	Description  interface{} //
	DeadLine     *gtime.Time //
	Completeness interface{} //
}
