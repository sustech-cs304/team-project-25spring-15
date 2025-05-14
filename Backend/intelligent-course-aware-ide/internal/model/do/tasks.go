// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
)

// Tasks is the golang structure of table Tasks for DAO operations like Where/Data.
type Tasks struct {
	g.Meta           `orm:"table:Tasks, do:true"`
	TaskId           interface{} //
	TargetApproverId interface{} //
	PublisherId      interface{} //
	PublisherName    interface{} //
	ReviewerId       interface{} //
	CourseId         interface{} //
	Decision         interface{} //
	Kind             interface{} //
	TaskInfo         interface{} //
	Comment          interface{} //
}
