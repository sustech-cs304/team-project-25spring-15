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
	FileSize     interface{} //
	FileUrl      interface{} //
	FileNameF    interface{} //
	FileType     interface{} //
	UploaderId   interface{} //
	UploadDate   *gtime.Time //
	LastModified *gtime.Time //
}
