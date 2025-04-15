// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// Files is the golang structure for table Files.
type Files struct {
	FileId       int64       `json:"fileId"       orm:"fileId"       description:""` //
	FileSize     int64       `json:"fileSize"     orm:"fileSize"     description:""` //
	FileUrl      string      `json:"fileUrl"      orm:"fileUrl"      description:""` //
	FileNameF    string      `json:"fileNameF"    orm:"fileName_F"   description:""` //
	FileType     string      `json:"fileType"     orm:"fileType"     description:""` //
	UploaderId   int64       `json:"uploaderId"   orm:"uploaderId"   description:""` //
	UploadDate   *gtime.Time `json:"uploadDate"   orm:"uploadDate"   description:""` //
	LastModified *gtime.Time `json:"lastModified" orm:"lastModified" description:""` //
}
