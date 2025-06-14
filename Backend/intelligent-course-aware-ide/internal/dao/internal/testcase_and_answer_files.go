// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// TestcaseAndAnswerFilesDao is the data access object for the table TestcaseAndAnswerFiles.
type TestcaseAndAnswerFilesDao struct {
	table   string                        // table is the underlying table name of the DAO.
	group   string                        // group is the database configuration group name of the current DAO.
	columns TestcaseAndAnswerFilesColumns // columns contains all the column names of Table for convenient usage.
}

// TestcaseAndAnswerFilesColumns defines and stores column names for the table TestcaseAndAnswerFiles.
type TestcaseAndAnswerFilesColumns struct {
	TestcaseAndAnswerId string //
	AssignmentId        string //
	PublisherId         string //
	TestcaseId          string //
	AnswerId            string //
	Score               string //
	FileType            string //
}

// testcaseAndAnswerFilesColumns holds the columns for the table TestcaseAndAnswerFiles.
var testcaseAndAnswerFilesColumns = TestcaseAndAnswerFilesColumns{
	TestcaseAndAnswerId: "testcaseAndAnswerId",
	AssignmentId:        "assignmentId",
	PublisherId:         "publisherId",
	TestcaseId:          "testcaseId",
	AnswerId:            "answerId",
	Score:               "score",
	FileType:            "fileType",
}

// NewTestcaseAndAnswerFilesDao creates and returns a new DAO object for table data access.
func NewTestcaseAndAnswerFilesDao() *TestcaseAndAnswerFilesDao {
	return &TestcaseAndAnswerFilesDao{
		group:   "default",
		table:   "TestcaseAndAnswerFiles",
		columns: testcaseAndAnswerFilesColumns,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *TestcaseAndAnswerFilesDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *TestcaseAndAnswerFilesDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *TestcaseAndAnswerFilesDao) Columns() TestcaseAndAnswerFilesColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *TestcaseAndAnswerFilesDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *TestcaseAndAnswerFilesDao) Ctx(ctx context.Context) *gdb.Model {
	return dao.DB().Model(dao.table).Safe().Ctx(ctx)
}

// Transaction wraps the transaction logic using function f.
// It rolls back the transaction and returns the error if function f returns a non-nil error.
// It commits the transaction and returns nil if function f returns nil.
//
// Note: Do not commit or roll back the transaction in function f,
// as it is automatically handled by this function.
func (dao *TestcaseAndAnswerFilesDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
