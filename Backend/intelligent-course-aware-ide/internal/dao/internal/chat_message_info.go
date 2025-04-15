// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// ChatMessageInfoDao is the data access object for the table ChatMessageInfo.
type ChatMessageInfoDao struct {
	table   string                 // table is the underlying table name of the DAO.
	group   string                 // group is the database configuration group name of the current DAO.
	columns ChatMessageInfoColumns // columns contains all the column names of Table for convenient usage.
}

// ChatMessageInfoColumns defines and stores column names for the table ChatMessageInfo.
type ChatMessageInfoColumns struct {
	MessageId string //
	ChatId    string //
	OwnerId   string //
	Message   string //
}

// chatMessageInfoColumns holds the columns for the table ChatMessageInfo.
var chatMessageInfoColumns = ChatMessageInfoColumns{
	MessageId: "messageId",
	ChatId:    "chatId",
	OwnerId:   "ownerId",
	Message:   "message",
}

// NewChatMessageInfoDao creates and returns a new DAO object for table data access.
func NewChatMessageInfoDao() *ChatMessageInfoDao {
	return &ChatMessageInfoDao{
		group:   "default",
		table:   "ChatMessageInfo",
		columns: chatMessageInfoColumns,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *ChatMessageInfoDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *ChatMessageInfoDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *ChatMessageInfoDao) Columns() ChatMessageInfoColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *ChatMessageInfoDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *ChatMessageInfoDao) Ctx(ctx context.Context) *gdb.Model {
	return dao.DB().Model(dao.table).Safe().Ctx(ctx)
}

// Transaction wraps the transaction logic using function f.
// It rolls back the transaction and returns the error if function f returns a non-nil error.
// It commits the transaction and returns nil if function f returns nil.
//
// Note: Do not commit or roll back the transaction in function f,
// as it is automatically handled by this function.
func (dao *ChatMessageInfoDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
