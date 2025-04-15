package v1

import "github.com/gogf/gf/v2/frame/g"

type UploadFileReq struct {
	g.Meta   `path:"/api/Files/v1/Courseware" method:"post" tags:"file" summary:"upload CourseFiles"`
	CourseId int64   `json:"courseId"` // 课程ID
	File     *g.File `json:"file"`     // 上传的文件
}

type UploadFileRes struct {
	Result string `json:"result"` // 上传结果
}
