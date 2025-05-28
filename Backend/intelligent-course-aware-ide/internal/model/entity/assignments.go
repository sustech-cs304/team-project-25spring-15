// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// Assignments is the golang structure for table Assignments.
type Assignments struct {
	AssignmentId   int64       `json:"assignmentId"   orm:"assignmentId"   description:""` //
	AssignmentName string      `json:"assignmentName" orm:"assignmentName" description:""` //
	PublisherId    int64       `json:"publisherId"    orm:"publisherId"    description:""` //
	CourseId       int64       `json:"courseId"       orm:"courseId"       description:""` //
	LectureId      int         `json:"lectureId"      orm:"lectureId"      description:""` //
	Description    string      `json:"description"    orm:"description"    description:""` //
	Deadline       *gtime.Time `json:"deadline"       orm:"deadline"       description:""` //
	Completeness   int         `json:"completeness"   orm:"completeness"   description:""` //
}
