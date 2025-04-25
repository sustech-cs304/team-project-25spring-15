// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

// AssignmentUserFeedback is the golang structure for table AssignmentUserFeedback.
type AssignmentUserFeedback struct {
	AssignmentUserFeedbackId int64  `json:"assignmentUserFeedbackId" orm:"assignmentUserFeedbackId" description:""` //
	AssignmentId             int64  `json:"assignmentId"             orm:"assignmentId"             description:""` //
	PerformerId              int64  `json:"performerId"              orm:"performerId"              description:""` //
	Score                    int    `json:"score"                    orm:"score"                    description:""` //
	FileId                   int64  `json:"fileId"                   orm:"fileId"                   description:""` //
	FileType                 string `json:"fileType"                 orm:"fileType"                 description:""` //
}
