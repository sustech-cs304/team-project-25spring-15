// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// AssignmentsDao is the data access object for the table Assignments.
type AssignmentsDao struct {
	table   string             // table is the underlying table name of the DAO.
	group   string             // group is the database configuration group name of the current DAO.
	columns AssignmentsColumns // columns contains all the column names of Table for convenient usage.
}

// AssignmentsColumns defines and stores column names for the table Assignments.
type AssignmentsColumns struct {
	AssignmentId string //
	PublisherId  string //
	CourseId     string //
	LectureId    string //
	DescriptionA string //
	DeadLine     string //
	Completeness string //
}

// assignmentsColumns holds the columns for the table Assignments.
var assignmentsColumns = AssignmentsColumns{
	AssignmentId: "assignmentId",
	PublisherId:  "publisherId",
	CourseId:     "courseId",
	LectureId:    "lectureId",
	DescriptionA: "description_A",
	DeadLine:     "deadLine",
	Completeness: "completeness",
}

// NewAssignmentsDao creates and returns a new DAO object for table data access.
func NewAssignmentsDao() *AssignmentsDao {
	return &AssignmentsDao{
		group:   "default",
		table:   "Assignments",
		columns: assignmentsColumns,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *AssignmentsDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *AssignmentsDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *AssignmentsDao) Columns() AssignmentsColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *AssignmentsDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *AssignmentsDao) Ctx(ctx context.Context) *gdb.Model {
	return dao.DB().Model(dao.table).Safe().Ctx(ctx)
}

// Transaction wraps the transaction logic using function f.
// It rolls back the transaction and returns the error if function f returns a non-nil error.
// It commits the transaction and returns nil if function f returns nil.
//
// Note: Do not commit or roll back the transaction in function f,
// as it is automatically handled by this function.
func (dao *AssignmentsDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
