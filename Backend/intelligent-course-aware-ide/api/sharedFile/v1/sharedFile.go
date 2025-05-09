package v1

import (
	"github.com/gogf/gf/v2/frame/g"
)

type CreateSharedFileReq struct {
	g.Meta `path:"/api/sharedFile/create" method:"post" tags:"sharedFile" summary:"create a shared file task"`
	FileId int64 `p:"fileId" v:"required"`
	UserId int64 `p:"userId" v:"required"`
}

type CreateSharedFileRes struct {
}

type UpdateSharedFileReq struct {
	g.Meta       `path:"/api/sharedFile/update" method:"put" tags:"sharedFile" summary:"update a shared file task"`
	FileId       int64  `p:"fileId" v:"required"`
	UserId       int64  `p:"userId" v:"required"`
	ChangeRecord string `p:"changeRecord" v:"required"`
}

type UpdateSharedFileRes struct {
}

type sharedFileUserGetInReq struct {
	g.Meta `path:"/api/sharedFile/userGetIn" method:"post" tags:"sharedFile" summary:"user get in shared file"`
	FileId int64 `p:"fileId" v:"required"`
	UserId int64 `p:"userId" v:"required"`
}

type sharedFileUserGetInRes struct {
}

type sharedFileUserGetOutReq struct {
	g.Meta `path:"/api/sharedFile/userGetOut" method:"post" tags:"sharedFile" summary:"user get out shared file"`
	FileId int64 `p:"fileId" v:"required"`
	UserId int64 `p:"userId" v:"required"`
}

type sharedFileUserGetOutRes struct {
}
