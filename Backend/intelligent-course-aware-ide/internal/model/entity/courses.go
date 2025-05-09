// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// Courses is the golang structure for table Courses.
type Courses struct {
	CourseId    int64       `json:"courseId"    orm:"courseId"    description:""` //
	TeacherId   int64       `json:"teacherId"   orm:"teacherId"   description:""` //
	CourseName  string      `json:"lectureName"  orm:"lectureName"  description:""` //
	Description string      `json:"description" orm:"description" description:""` //
	StartTime   *gtime.Time `json:"startTime"   orm:"startTime"   description:""` //
	EndTime     *gtime.Time `json:"endTime"     orm:"endTime"     description:""` //
}
