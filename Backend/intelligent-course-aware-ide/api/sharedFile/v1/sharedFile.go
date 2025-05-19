package v1

import (
	"github.com/gogf/gf/v2/frame/g"
)

type CreateSharedFileReq struct {
	g.Meta `path:"/api/sharedFile/create" method:"post" tags:"sharedFile" summary:"create a shared file task"`
	FileId int64 `p:"fileId" v:"required" dc:"A file which belongs to the user"`
	UserId int64 `p:"userId" v:"required" dc:"The id of the user who want to upload the file as a shared file."`
}

type CreateSharedFileRes struct {
}

type SharedFileUserGetInReq struct {
	g.Meta `path:"/api/sharedFile/userGetIn" method:"post" tags:"sharedFile" summary:"user get in shared file"`
	FileId int64 `p:"fileId" v:"required"`
	UserId int64 `p:"userId" v:"required"`
}

type SharedFileUserGetInRes struct {
}

type SharedFileUserGetOutReq struct {
	g.Meta `path:"/api/sharedFile/userGetOut" method:"post" tags:"sharedFile" summary:"user get out shared file"`
	FileId int64 `p:"fileId" v:"required"`
	UserId int64 `p:"userId" v:"required"`
}

type SharedFileUserGetOutRes struct {
}

// 更新共享文件请求结构
type UpdateSharedFileReq struct {
	g.Meta       `path:"/api/sharedFile/update" method:"put" tags:"sharedFile" summary:"update a shared file task"`
	FileId       int64  `p:"fileId" v:"required" dc:"The file to be changed"`
	UserId       int64  `p:"userId" v:"required" dc:"The user who changes the file"`
	ChangeRecord string `p:"changeRecord" v:"required" dc:"Record the change in specific format"`
}

type UpdateSharedFileRes struct {
}

// WebSocket连接请求
type ConnectSharedFileReq struct {
	g.Meta `path:"/ws/sharedFile/connect" method:"get" tags:"sharedFile" summary:"connect to shared file editing"`
	FileId int64 `p:"fileId" v:"required" dc:"The file to connect"`
	UserId int64 `p:"userId" v:"required" dc:"The user who connects"`
}

type ConnectSharedFileRes struct {
}

// 获取文件内容及操作历史请求
type GetSharedFileContentReq struct {
	g.Meta `path:"/api/sharedFile/content" method:"get" tags:"sharedFile" summary:"get shared file content"`
	FileId int64 `p:"fileId" v:"required" dc:"The file to get content for"`
	UserId int64 `p:"userId" v:"required" dc:"The requesting user"`
}

type GetSharedFileContentRes struct {
}
