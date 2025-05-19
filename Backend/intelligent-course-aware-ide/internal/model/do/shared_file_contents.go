// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// SharedFileContents is the golang structure of table SharedFileContents for DAO operations like Where/Data.
type SharedFileContents struct {
	g.Meta        `orm:"table:SharedFileContents, do:true"`
	FileId        interface{} //
	Content       interface{} //
	LastUpdatedAt *gtime.Time //
	Version       interface{} //
}
