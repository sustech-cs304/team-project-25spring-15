// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// SharedFileOperations is the golang structure of table SharedFileOperations for DAO operations like Where/Data.
type SharedFileOperations struct {
	g.Meta             `orm:"table:SharedFileOperations, do:true"`
	OperationId        interface{} //
	FileId             interface{} //
	UserId             interface{} //
	OperationType      interface{} //
	Position           interface{} //
	Content            interface{} //
	Timestamp          *gtime.Time //
	IsUndoOperation    interface{} //
	UndoForOperationId interface{} //
}
