// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// Courses is the golang structure of table Courses for DAO operations like Where/Data.
type Courses struct {
	g.Meta       `orm:"table:Courses, do:true"`
	CourseId     interface{} //
	CourseName   interface{} //
	DescriptionC interface{} //
	StartTime    *gtime.Time //
	EndTime      *gtime.Time //
}
