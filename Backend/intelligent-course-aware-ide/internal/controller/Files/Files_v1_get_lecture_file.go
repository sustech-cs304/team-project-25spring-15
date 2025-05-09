package Files

import (
	"context"

	v1 "intelligent-course-aware-ide/api/Files/v1"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"
)

// GetLectureFile handles downloading a lecture file
func (c *ControllerV1) GetLectureFile(ctx context.Context, req *v1.GetLectureFileReq) (res *v1.GetLectureFileRes, err error) {
	var filePath string
	err = g.DB().Model("Files").Where("lectureId", req.FileId).Fields("storePath").Scan(&filePath)
	if err != nil {
		return nil, err
	}
	if filePath == "" {
		return nil, gerror.New("文件不存在")
	}

	r := g.RequestFromCtx(ctx)

	r.Response.ServeFileDownload(filePath)

	return nil, nil
}
