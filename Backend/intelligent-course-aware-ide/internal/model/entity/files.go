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
	CourseId     int64       `json:"courseId"     orm:"courseId"     description:""` //
	OwnerId      int64       `json:"ownerId"      orm:"ownerId"      description:""` //
	FileSize     int64       `json:"fileSize"     orm:"fileSize"     description:""` //
	FileUrl      string      `json:"fileUrl"      orm:"fileUrl"      description:""` //
	FileName     string      `json:"fileName"     orm:"fileName"     description:""` //
	FileType     string      `json:"fileType"     orm:"fileType"     description:""` //
	UploadDate   *gtime.Time `json:"uploadDate"   orm:"uploadDate"   description:""` //
	LastModified *gtime.Time `json:"lastModified" orm:"lastModified" description:""` //
}
