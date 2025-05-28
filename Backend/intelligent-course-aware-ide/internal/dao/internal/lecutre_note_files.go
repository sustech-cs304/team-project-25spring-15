// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// LecutreNoteFilesDao is the data access object for the table LecutreNoteFiles.
type LecutreNoteFilesDao struct {
	table    string                  // table is the underlying table name of the DAO.
	group    string                  // group is the database configuration group name of the current DAO.
	columns  LecutreNoteFilesColumns // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler      // handlers for customized model modification.
}

// LecutreNoteFilesColumns defines and stores column names for the table LecutreNoteFiles.
type LecutreNoteFilesColumns struct {
	FileId    string //
	LectureId string //
}

// lecutreNoteFilesColumns holds the columns for the table LecutreNoteFiles.
var lecutreNoteFilesColumns = LecutreNoteFilesColumns{
	FileId:    "fileId",
	LectureId: "lectureId",
}

// NewLecutreNoteFilesDao creates and returns a new DAO object for table data access.
func NewLecutreNoteFilesDao(handlers ...gdb.ModelHandler) *LecutreNoteFilesDao {
	return &LecutreNoteFilesDao{
		group:    "default",
		table:    "LecutreNoteFiles",
		columns:  lecutreNoteFilesColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *LecutreNoteFilesDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *LecutreNoteFilesDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *LecutreNoteFilesDao) Columns() LecutreNoteFilesColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *LecutreNoteFilesDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *LecutreNoteFilesDao) Ctx(ctx context.Context) *gdb.Model {
	model := dao.DB().Model(dao.table)
	for _, handler := range dao.handlers {
		model = handler(model)
	}
	return model.Safe().Ctx(ctx)
}

// Transaction wraps the transaction logic using function f.
// It rolls back the transaction and returns the error if function f returns a non-nil error.
// It commits the transaction and returns nil if function f returns nil.
//
// Note: Do not commit or roll back the transaction in function f,
// as it is automatically handled by this function.
func (dao *LecutreNoteFilesDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
