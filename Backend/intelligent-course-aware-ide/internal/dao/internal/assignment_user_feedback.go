// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// AssignmentUserFeedbackDao is the data access object for the table AssignmentUserFeedback.
type AssignmentUserFeedbackDao struct {
	table   string                        // table is the underlying table name of the DAO.
	group   string                        // group is the database configuration group name of the current DAO.
	columns AssignmentUserFeedbackColumns // columns contains all the column names of Table for convenient usage.
}

// AssignmentUserFeedbackColumns defines and stores column names for the table AssignmentUserFeedback.
type AssignmentUserFeedbackColumns struct {
	AssignmentUserFeedbackId string //
	AssignmentId             string //
	PerformerId              string //
	Score                    string //
	FileId                   string //
	FileType                 string //
}

// assignmentUserFeedbackColumns holds the columns for the table AssignmentUserFeedback.
var assignmentUserFeedbackColumns = AssignmentUserFeedbackColumns{
	AssignmentUserFeedbackId: "assignmentUserFeedbackId",
	AssignmentId:             "assignmentId",
	PerformerId:              "performerId",
	Score:                    "score",
	FileId:                   "fileId",
	FileType:                 "fileType",
}

// NewAssignmentUserFeedbackDao creates and returns a new DAO object for table data access.
func NewAssignmentUserFeedbackDao() *AssignmentUserFeedbackDao {
	return &AssignmentUserFeedbackDao{
		group:   "default",
		table:   "AssignmentUserFeedback",
		columns: assignmentUserFeedbackColumns,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *AssignmentUserFeedbackDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *AssignmentUserFeedbackDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *AssignmentUserFeedbackDao) Columns() AssignmentUserFeedbackColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *AssignmentUserFeedbackDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *AssignmentUserFeedbackDao) Ctx(ctx context.Context) *gdb.Model {
	return dao.DB().Model(dao.table).Safe().Ctx(ctx)
}

// Transaction wraps the transaction logic using function f.
// It rolls back the transaction and returns the error if function f returns a non-nil error.
// It commits the transaction and returns nil if function f returns nil.
//
// Note: Do not commit or roll back the transaction in function f,
// as it is automatically handled by this function.
func (dao *AssignmentUserFeedbackDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
