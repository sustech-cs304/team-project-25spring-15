// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

// TestcaseAndAnswerFiles is the golang structure for table TestcaseAndAnswerFiles.
type TestcaseAndAnswerFiles struct {
	TestcaseAndAnswerId int64  `json:"testcaseAndAnswerId" orm:"testcaseAndAnswerId" description:""` //
	AssignmentId        int64  `json:"assignmentId"        orm:"assignmentId"        description:""` //
	PublisherId         int64  `json:"publisherId"         orm:"publisherId"         description:""` //
	TestcaseId          int64  `json:"testcaseId"          orm:"testcaseId"          description:""` //
	AnswerId            int64  `json:"answerId"            orm:"answerId"            description:""` //
	FileType            string `json:"fileType"            orm:"fileType"            description:""` //
}
