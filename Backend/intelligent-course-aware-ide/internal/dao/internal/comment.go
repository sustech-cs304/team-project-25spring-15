// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// CommentDao is the data access object for the table Comment.
type CommentDao struct {
	table   string         // table is the underlying table name of the DAO.
	group   string         // group is the database configuration group name of the current DAO.
	columns CommentColumns // columns contains all the column names of Table for convenient usage.
}

// CommentColumns defines and stores column names for the table Comment.
type CommentColumns struct {
	CommentId            string //
	RepliedToCommentedId string //
	LectureId            string //
	AuthorId             string //
	Content              string //
	CreateTime           string //
	Likes                string //
}

// commentColumns holds the columns for the table Comment.
var commentColumns = CommentColumns{
	CommentId:            "commentId",
	RepliedToCommentedId: "repliedToCommentedId",
	LectureId:            "lectureId",
	AuthorId:             "authorId",
	Content:              "content",
	CreateTime:           "createTime",
	Likes:                "likes",
}

// NewCommentDao creates and returns a new DAO object for table data access.
func NewCommentDao() *CommentDao {
	return &CommentDao{
		group:   "default",
		table:   "Comment",
		columns: commentColumns,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *CommentDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *CommentDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *CommentDao) Columns() CommentColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *CommentDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *CommentDao) Ctx(ctx context.Context) *gdb.Model {
	return dao.DB().Model(dao.table).Safe().Ctx(ctx)
}

// Transaction wraps the transaction logic using function f.
// It rolls back the transaction and returns the error if function f returns a non-nil error.
// It commits the transaction and returns nil if function f returns nil.
//
// Note: Do not commit or roll back the transaction in function f,
// as it is automatically handled by this function.
func (dao *CommentDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
