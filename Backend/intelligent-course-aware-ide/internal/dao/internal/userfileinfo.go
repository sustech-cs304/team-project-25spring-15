// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// UserfileinfoDao is the data access object for the table userfileinfo.
type UserfileinfoDao struct {
	table   string              // table is the underlying table name of the DAO.
	group   string              // group is the database configuration group name of the current DAO.
	columns UserfileinfoColumns // columns contains all the column names of Table for convenient usage.
}

// UserfileinfoColumns defines and stores column names for the table userfileinfo.
type UserfileinfoColumns struct {
	UserId    string //
	FileId    string //
	Authority string //
}

// userfileinfoColumns holds the columns for the table userfileinfo.
var userfileinfoColumns = UserfileinfoColumns{
	UserId:    "userId",
	FileId:    "fileId",
	Authority: "authority",
}

// NewUserfileinfoDao creates and returns a new DAO object for table data access.
func NewUserfileinfoDao() *UserfileinfoDao {
	return &UserfileinfoDao{
		group:   "default",
		table:   "userfileinfo",
		columns: userfileinfoColumns,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *UserfileinfoDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *UserfileinfoDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *UserfileinfoDao) Columns() UserfileinfoColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *UserfileinfoDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *UserfileinfoDao) Ctx(ctx context.Context) *gdb.Model {
	return dao.DB().Model(dao.table).Safe().Ctx(ctx)
}

// Transaction wraps the transaction logic using function f.
// It rolls back the transaction and returns the error if function f returns a non-nil error.
// It commits the transaction and returns nil if function f returns nil.
//
// Note: Do not commit or roll back the transaction in function f,
// as it is automatically handled by this function.
func (dao *UserfileinfoDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
