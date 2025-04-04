// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// Assignments is the golang structure for table assignments.
type Assignments struct {
	AssignmentId int64       `json:"assignmentId" orm:"assignmentId" description:""` //
	OwnerId      int64       `json:"ownerId"      orm:"ownerId"      description:""` //
	CourseId     int64       `json:"courseId"     orm:"courseId"     description:""` //
	Description  string      `json:"description"  orm:"description"  description:""` //
	DeadLine     *gtime.Time `json:"deadLine"     orm:"deadLine"     description:""` //
	Completeness int         `json:"completeness" orm:"completeness" description:""` //
}
