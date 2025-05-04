// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
)

// TestcaseAndAnswerFiles is the golang structure of table TestcaseAndAnswerFiles for DAO operations like Where/Data.
type TestcaseAndAnswerFiles struct {
	g.Meta              `orm:"table:TestcaseAndAnswerFiles, do:true"`
	TestcaseAndAnswerId interface{} //
	AssignmentId        interface{} //
	PublisherId         interface{} //
	TestcaseId          interface{} //
	AnswerId            interface{} //
	Score               interface{} //
	FileType            interface{} //
}
