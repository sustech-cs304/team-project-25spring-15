// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// FilesDao is the data access object for the table Files.
type FilesDao struct {
	table    string             // table is the underlying table name of the DAO.
	group    string             // group is the database configuration group name of the current DAO.
	columns  FilesColumns       // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler // handlers for customized model modification.
}

// FilesColumns defines and stores column names for the table Files.
type FilesColumns struct {
	FileId       string //
	FileSize     string //
	FileUrl      string //
	FileName     string //
	FileType     string //
	UploaderId   string //
	UploadDate   string //
	LastModified string //
}

// filesColumns holds the columns for the table Files.
var filesColumns = FilesColumns{
	FileId:       "fileId",
	FileSize:     "fileSize",
	FileUrl:      "fileUrl",
	FileName:     "fileName",
	FileType:     "fileType",
	UploaderId:   "uploaderId",
	UploadDate:   "uploadDate",
	LastModified: "lastModified",
}

// NewFilesDao creates and returns a new DAO object for table data access.
func NewFilesDao(handlers ...gdb.ModelHandler) *FilesDao {
	return &FilesDao{
		group:    "default",
		table:    "Files",
		columns:  filesColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *FilesDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *FilesDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *FilesDao) Columns() FilesColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *FilesDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *FilesDao) Ctx(ctx context.Context) *gdb.Model {
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
func (dao *FilesDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
