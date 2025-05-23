// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// SharedFileContents is the golang structure for table SharedFileContents.
type SharedFileContents struct {
	FileId        int64       `json:"fileId"        orm:"fileId"        description:""` //
	Content       string      `json:"content"       orm:"content"       description:""` //
	LastUpdatedAt *gtime.Time `json:"lastUpdatedAt" orm:"lastUpdatedAt" description:""` //
	Version       int         `json:"version"       orm:"version"       description:""` //
}
