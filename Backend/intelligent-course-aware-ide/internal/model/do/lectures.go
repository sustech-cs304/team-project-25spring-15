// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
)

// Lectures is the golang structure of table Lectures for DAO operations like Where/Data.
type Lectures struct {
	g.Meta      `orm:"table:Lectures, do:true"`
	LectureId   interface{} //
	CourseId    interface{} //
	LectureName interface{} //
	Description interface{} //
}
