// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// Courses is the golang structure for table courses.
type Courses struct {
	CourseId    int64       `json:"courseId"    orm:"courseId"    description:""` //
	CourseName  string      `json:"courseName"  orm:"courseName"  description:""` //
	Description string      `json:"description" orm:"description" description:""` //
	StartTime   *gtime.Time `json:"startTime"   orm:"startTime"   description:""` //
	EndTime     *gtime.Time `json:"endTime"     orm:"endTime"     description:""` //
}
