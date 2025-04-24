// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

// Lectures is the golang structure for table Lectures.
type Lectures struct {
	LectureId   int    `json:"lectureId"   orm:"lectureId"   description:""` //
	CourseId    int64  `json:"courseId"    orm:"courseId"    description:""` //
	LectureName string `json:"lectureName" orm:"lectureName" description:""` //
	Description string `json:"description" orm:"description" description:""` //
}
