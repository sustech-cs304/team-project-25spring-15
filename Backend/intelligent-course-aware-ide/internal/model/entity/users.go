// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// Users is the golang structure for table Users.
type Users struct {
	UserId     int64       `json:"userId"     orm:"userId"     description:""` //
	UserName   string      `json:"userName"   orm:"userName"   description:""` //
	Password   string      `json:"password"   orm:"password"   description:""` //
	Email      string      `json:"email"      orm:"email"      description:""` //
	UserSign   string      `json:"userSign"   orm:"userSign"   description:""` //
	University string      `json:"university" orm:"university" description:""` //
	Birthday   *gtime.Time `json:"birthday"   orm:"birthday"   description:""` //
	Login      int         `json:"login"      orm:"login"      description:""` //
	Identity   string      `json:"identity"   orm:"identity"   description:""` //
}
