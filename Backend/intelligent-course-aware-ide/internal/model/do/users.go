// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// Users is the golang structure of table Users for DAO operations like Where/Data.
type Users struct {
	g.Meta     `orm:"table:Users, do:true"`
	UserId     interface{} //
	UserName   interface{} //
	Password   interface{} //
	Email      interface{} //
	UserSign   interface{} //
	University interface{} //
	Birthday   *gtime.Time //
}
