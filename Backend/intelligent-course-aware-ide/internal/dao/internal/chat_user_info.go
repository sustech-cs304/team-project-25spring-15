// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// ChatUserInfoDao is the data access object for the table ChatUserInfo.
type ChatUserInfoDao struct {
	table   string              // table is the underlying table name of the DAO.
	group   string              // group is the database configuration group name of the current DAO.
	columns ChatUserInfoColumns // columns contains all the column names of Table for convenient usage.
}

// ChatUserInfoColumns defines and stores column names for the table ChatUserInfo.
type ChatUserInfoColumns struct {
	UserId  string //
	ChatId  string //
	HasRead string //
}

// chatUserInfoColumns holds the columns for the table ChatUserInfo.
var chatUserInfoColumns = ChatUserInfoColumns{
	UserId:  "userId",
	ChatId:  "chatId",
	HasRead: "hasRead",
}

// NewChatUserInfoDao creates and returns a new DAO object for table data access.
func NewChatUserInfoDao() *ChatUserInfoDao {
	return &ChatUserInfoDao{
		group:   "default",
		table:   "ChatUserInfo",
		columns: chatUserInfoColumns,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *ChatUserInfoDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *ChatUserInfoDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *ChatUserInfoDao) Columns() ChatUserInfoColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *ChatUserInfoDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *ChatUserInfoDao) Ctx(ctx context.Context) *gdb.Model {
	return dao.DB().Model(dao.table).Safe().Ctx(ctx)
}

// Transaction wraps the transaction logic using function f.
// It rolls back the transaction and returns the error if function f returns a non-nil error.
// It commits the transaction and returns nil if function f returns nil.
//
// Note: Do not commit or roll back the transaction in function f,
// as it is automatically handled by this function.
func (dao *ChatUserInfoDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
