// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// LectureFilesDao is the data access object for the table LectureFiles.
type LectureFilesDao struct {
	table   string              // table is the underlying table name of the DAO.
	group   string              // group is the database configuration group name of the current DAO.
	columns LectureFilesColumns // columns contains all the column names of Table for convenient usage.
}

// LectureFilesColumns defines and stores column names for the table LectureFiles.
type LectureFilesColumns struct {
	FileId    string //
	LectureId string //
}

// lectureFilesColumns holds the columns for the table LectureFiles.
var lectureFilesColumns = LectureFilesColumns{
	FileId:    "fileId",
	LectureId: "lectureId",
}

// NewLectureFilesDao creates and returns a new DAO object for table data access.
func NewLectureFilesDao() *LectureFilesDao {
	return &LectureFilesDao{
		group:   "default",
		table:   "LectureFiles",
		columns: lectureFilesColumns,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *LectureFilesDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *LectureFilesDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *LectureFilesDao) Columns() LectureFilesColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *LectureFilesDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *LectureFilesDao) Ctx(ctx context.Context) *gdb.Model {
	return dao.DB().Model(dao.table).Safe().Ctx(ctx)
}

// Transaction wraps the transaction logic using function f.
// It rolls back the transaction and returns the error if function f returns a non-nil error.
// It commits the transaction and returns nil if function f returns nil.
//
// Note: Do not commit or roll back the transaction in function f,
// as it is automatically handled by this function.
func (dao *LectureFilesDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
