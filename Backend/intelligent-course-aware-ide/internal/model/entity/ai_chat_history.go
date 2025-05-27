// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// AIChatHistory is the golang structure for table AIChatHistory.
type AIChatHistory struct {
	ChatId    string      `json:"chatId"    orm:"chatId"    description:""` //
	LectureId int         `json:"lectureId" orm:"lectureId" description:""` //
	UserId    int64       `json:"userId"    orm:"userId"    description:""` //
	Role      string      `json:"role"      orm:"role"      description:""` //
	Parts     string      `json:"parts"     orm:"parts"     description:""` //
	CreateAt  *gtime.Time `json:"createAt"  orm:"createAt"  description:""` //
}
