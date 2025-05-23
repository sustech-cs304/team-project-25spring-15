// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// SharedFilePartnersDao is the data access object for the table SharedFilePartners.
type SharedFilePartnersDao struct {
	table    string                    // table is the underlying table name of the DAO.
	group    string                    // group is the database configuration group name of the current DAO.
	columns  SharedFilePartnersColumns // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler        // handlers for customized model modification.
}

// SharedFilePartnersColumns defines and stores column names for the table SharedFilePartners.
type SharedFilePartnersColumns struct {
	SharedFileId string //
	UserId       string //
	IsOnline     string //
	IsManager    string //
}

// sharedFilePartnersColumns holds the columns for the table SharedFilePartners.
var sharedFilePartnersColumns = SharedFilePartnersColumns{
	SharedFileId: "sharedFileId",
	UserId:       "userId",
	IsOnline:     "isOnline",
	IsManager:    "isManager",
}

// NewSharedFilePartnersDao creates and returns a new DAO object for table data access.
func NewSharedFilePartnersDao(handlers ...gdb.ModelHandler) *SharedFilePartnersDao {
	return &SharedFilePartnersDao{
		group:    "default",
		table:    "SharedFilePartners",
		columns:  sharedFilePartnersColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *SharedFilePartnersDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *SharedFilePartnersDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *SharedFilePartnersDao) Columns() SharedFilePartnersColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *SharedFilePartnersDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *SharedFilePartnersDao) Ctx(ctx context.Context) *gdb.Model {
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
func (dao *SharedFilePartnersDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
