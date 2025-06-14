// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// UserFileInfoDao is the data access object for the table UserFileInfo.
type UserFileInfoDao struct {
	table   string              // table is the underlying table name of the DAO.
	group   string              // group is the database configuration group name of the current DAO.
	columns UserFileInfoColumns // columns contains all the column names of Table for convenient usage.
}

// UserFileInfoColumns defines and stores column names for the table UserFileInfo.
type UserFileInfoColumns struct {
	UserId       string //
	AssignmentId string //
	FileId       string //
}

// userFileInfoColumns holds the columns for the table UserFileInfo.
var userFileInfoColumns = UserFileInfoColumns{
	UserId:       "userId",
	AssignmentId: "assignmentId",
	FileId:       "fileId",
}

// NewUserFileInfoDao creates and returns a new DAO object for table data access.
func NewUserFileInfoDao() *UserFileInfoDao {
	return &UserFileInfoDao{
		group:   "default",
		table:   "UserFileInfo",
		columns: userFileInfoColumns,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *UserFileInfoDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *UserFileInfoDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *UserFileInfoDao) Columns() UserFileInfoColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *UserFileInfoDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *UserFileInfoDao) Ctx(ctx context.Context) *gdb.Model {
	return dao.DB().Model(dao.table).Safe().Ctx(ctx)
}

// Transaction wraps the transaction logic using function f.
// It rolls back the transaction and returns the error if function f returns a non-nil error.
// It commits the transaction and returns nil if function f returns nil.
//
// Note: Do not commit or roll back the transaction in function f,
// as it is automatically handled by this function.
func (dao *UserFileInfoDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
