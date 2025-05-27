// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// LecturesDao is the data access object for the table Lectures.
type LecturesDao struct {
	table   string          // table is the underlying table name of the DAO.
	group   string          // group is the database configuration group name of the current DAO.
	columns LecturesColumns // columns contains all the column names of Table for convenient usage.
}

// LecturesColumns defines and stores column names for the table Lectures.
type LecturesColumns struct {
	LectureId   string //
	CourseId    string //
	LectureName string //
	Description string //
}

// lecturesColumns holds the columns for the table Lectures.
var lecturesColumns = LecturesColumns{
	LectureId:   "lectureId",
	CourseId:    "courseId",
	LectureName: "lectureName",
	Description: "description",
}

// NewLecturesDao creates and returns a new DAO object for table data access.
func NewLecturesDao() *LecturesDao {
	return &LecturesDao{
		group:   "default",
		table:   "Lectures",
		columns: lecturesColumns,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *LecturesDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *LecturesDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *LecturesDao) Columns() LecturesColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *LecturesDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *LecturesDao) Ctx(ctx context.Context) *gdb.Model {
	return dao.DB().Model(dao.table).Safe().Ctx(ctx)
}

// Transaction wraps the transaction logic using function f.
// It rolls back the transaction and returns the error if function f returns a non-nil error.
// It commits the transaction and returns nil if function f returns nil.
//
// Note: Do not commit or roll back the transaction in function f,
// as it is automatically handled by this function.
func (dao *LecturesDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
