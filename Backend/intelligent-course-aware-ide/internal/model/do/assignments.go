// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// Assignments is the golang structure of table Assignments for DAO operations like Where/Data.
type Assignments struct {
	g.Meta         `orm:"table:Assignments, do:true"`
	AssignmentId   interface{} //
	AssignmentName interface{} //
	PublisherId    interface{} //
	CourseId       interface{} //
	LectureId      interface{} //
	Description    interface{} //
	DeadLine       *gtime.Time //
	Completeness   interface{} //
}
