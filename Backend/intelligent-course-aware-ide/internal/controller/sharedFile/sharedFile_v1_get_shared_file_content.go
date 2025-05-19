package sharedFile

import (
	"context"

	v1 "intelligent-course-aware-ide/api/sharedFile/v1"
	"intelligent-course-aware-ide/internal/logic/socket"
)

func (c *ControllerV1) GetSharedFileContent(ctx context.Context, req *v1.GetSharedFileContentReq) (res *v1.GetSharedFileContentRes, err error) {
	content, err := socket.GetFileContent(ctx, req.FileId, req.UserId)
	if err != nil {
		return nil, err
	}

	return &v1.GetSharedFileContentRes{
		Content: content,
	}, nil
}
