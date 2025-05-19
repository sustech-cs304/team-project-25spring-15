package sharedFile

import (
	"context"

	"github.com/gogf/gf/frame/g"
	"github.com/gogf/gf/v2/errors/gerror"

	v1 "intelligent-course-aware-ide/api/sharedFile/v1"
	"intelligent-course-aware-ide/internal/logic/socket"
)

// 更新共享文件内容
func (c *ControllerV1) UpdateSharedFile(ctx context.Context, req *v1.UpdateSharedFileReq) (res *v1.UpdateSharedFileRes, err error) {
	// 验证用户权限
	count, err := g.Model("SharedFilePartners").
		Where("sharedFileId=? AND userId=?", req.FileId, req.UserId).
		Count()
	if err != nil || count == 0 {
		return nil, gerror.New("User has no permission to update this file")
	}

	// 处理更新请求
	if err := socket.UpdateFileContent(ctx, req.FileId, req.UserId, req.ChangeRecord); err != nil {
		return nil, err
	}

	return &v1.UpdateSharedFileRes{}, nil
}
