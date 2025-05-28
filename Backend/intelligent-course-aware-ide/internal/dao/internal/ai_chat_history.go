// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// AIChatHistoryDao is the data access object for the table AIChatHistory.
type AIChatHistoryDao struct {
	table   string               // table is the underlying table name of the DAO.
	group   string               // group is the database configuration group name of the current DAO.
	columns AIChatHistoryColumns // columns contains all the column names of Table for convenient usage.
}

// AIChatHistoryColumns defines and stores column names for the table AIChatHistory.
type AIChatHistoryColumns struct {
	ChatId    string //
	LectureId string //
	UserId    string //
	Role      string //
	Parts     string //
	CreateAt  string //
}

// aIChatHistoryColumns holds the columns for the table AIChatHistory.
var aIChatHistoryColumns = AIChatHistoryColumns{
	ChatId:    "chatId",
	LectureId: "lectureId",
	UserId:    "userId",
	Role:      "role",
	Parts:     "parts",
	CreateAt:  "createAt",
}

// NewAIChatHistoryDao creates and returns a new DAO object for table data access.
func NewAIChatHistoryDao() *AIChatHistoryDao {
	return &AIChatHistoryDao{
		group:   "default",
		table:   "AIChatHistory",
		columns: aIChatHistoryColumns,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *AIChatHistoryDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *AIChatHistoryDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *AIChatHistoryDao) Columns() AIChatHistoryColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *AIChatHistoryDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *AIChatHistoryDao) Ctx(ctx context.Context) *gdb.Model {
	return dao.DB().Model(dao.table).Safe().Ctx(ctx)
}

// Transaction wraps the transaction logic using function f.
// It rolls back the transaction and returns the error if function f returns a non-nil error.
// It commits the transaction and returns nil if function f returns nil.
//
// Note: Do not commit or roll back the transaction in function f,
// as it is automatically handled by this function.
func (dao *AIChatHistoryDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
