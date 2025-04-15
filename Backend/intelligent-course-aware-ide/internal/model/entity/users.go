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
	PasswordU  string      `json:"passwordU"  orm:"password_U" description:""` //
	Email      string      `json:"email"      orm:"email"      description:""` //
	UserSign   string      `json:"userSign"   orm:"userSign"   description:""` //
	University string      `json:"university" orm:"university" description:""` //
	Birthday   *gtime.Time `json:"birthday"   orm:"birthday"   description:""` //
	IdentityU  string      `json:"identityU"  orm:"identity_U" description:""` //
}
