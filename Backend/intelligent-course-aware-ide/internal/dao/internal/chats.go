// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// ChatsDao is the data access object for the table Chats.
type ChatsDao struct {
	table   string       // table is the underlying table name of the DAO.
	group   string       // group is the database configuration group name of the current DAO.
	columns ChatsColumns // columns contains all the column names of Table for convenient usage.
}

// ChatsColumns defines and stores column names for the table Chats.
type ChatsColumns struct {
	ChatId   string //
	OwnerId  string //
	ChatName string //
}

// chatsColumns holds the columns for the table Chats.
var chatsColumns = ChatsColumns{
	ChatId:   "chatId",
	OwnerId:  "ownerId",
	ChatName: "chatName",
}

// NewChatsDao creates and returns a new DAO object for table data access.
func NewChatsDao() *ChatsDao {
	return &ChatsDao{
		group:   "default",
		table:   "Chats",
		columns: chatsColumns,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *ChatsDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *ChatsDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *ChatsDao) Columns() ChatsColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *ChatsDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *ChatsDao) Ctx(ctx context.Context) *gdb.Model {
	return dao.DB().Model(dao.table).Safe().Ctx(ctx)
}

// Transaction wraps the transaction logic using function f.
// It rolls back the transaction and returns the error if function f returns a non-nil error.
// It commits the transaction and returns nil if function f returns nil.
//
// Note: Do not commit or roll back the transaction in function f,
// as it is automatically handled by this function.
func (dao *ChatsDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
