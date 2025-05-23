// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// SharedFileOperations is the golang structure for table SharedFileOperations.
type SharedFileOperations struct {
	OperationId        int64       `json:"operationId"        orm:"operationId"        description:""` //
	FileId             int64       `json:"fileId"             orm:"fileId"             description:""` //
	UserId             int64       `json:"userId"             orm:"userId"             description:""` //
	OperationType      string      `json:"operationType"      orm:"operationType"      description:""` //
	Position           int         `json:"position"           orm:"position"           description:""` //
	Content            string      `json:"content"            orm:"content"            description:""` //
	Timestamp          *gtime.Time `json:"timestamp"          orm:"timestamp"          description:""` //
	IsUndoOperation    int         `json:"isUndoOperation"    orm:"isUndoOperation"    description:""` //
	UndoForOperationId int64       `json:"undoForOperationId" orm:"undoForOperationId" description:""` //
}
