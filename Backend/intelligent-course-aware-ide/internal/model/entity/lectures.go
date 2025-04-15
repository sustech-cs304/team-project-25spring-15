// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

// Lectures is the golang structure for table Lectures.
type Lectures struct {
	LectureId    int    `json:"lectureId"    orm:"lectureId"     description:""` //
	CourseId     int64  `json:"courseId"     orm:"courseId"      description:""` //
	LectureName  string `json:"lectureName"  orm:"lectureName"   description:""` //
	DescriptionL string `json:"descriptionL" orm:"description_L" description:""` //
}
