package Files

import (
	"context"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"

	v1 "intelligent-course-aware-ide/api/Files/v1"
)

func (c *ControllerV1) GetFileWithLectureId(ctx context.Context, req *v1.GetFileWithLectureIdReq) (res *v1.GetFileWithLectureIdRes, err error) {
	var filePath string
	err = g.DB().Model("Files").Where("LectureId", req.LecutreId).Fields("storePath").Scan(&filePath)
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
