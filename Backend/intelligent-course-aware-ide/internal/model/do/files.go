// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// Files is the golang structure of table Files for DAO operations like Where/Data.
type Files struct {
	g.Meta       `orm:"table:Files, do:true"`
	FileId       interface{} //
	CourseId     interface{} //
	OwnerId      interface{} //
	FileSize     interface{} //
	FileUrl      interface{} //
	FileName     interface{} //
	FileType     interface{} //
	UploadDate   *gtime.Time //
	LastModified *gtime.Time //
}
