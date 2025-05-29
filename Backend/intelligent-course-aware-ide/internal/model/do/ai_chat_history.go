// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// AIChatHistory is the golang structure of table AIChatHistory for DAO operations like Where/Data.
type AIChatHistory struct {
	g.Meta    `orm:"table:AIChatHistory, do:true"`
	ChatId    interface{} //
	LectureId interface{} //
	UserId    interface{} //
	Role      interface{} //
	Parts     interface{} //
	CreateAt  *gtime.Time //
}
