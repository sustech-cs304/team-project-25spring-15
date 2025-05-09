package Files

import (
	"context"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gfile"

	v1 "intelligent-course-aware-ide/api/Files/v1"
)

func (c *ControllerV1) DeleteLectureFile(ctx context.Context, req *v1.DeleteLectureFileReq) (res *v1.DeleteLectureFileRes, err error) {
	res = &v1.DeleteLectureFileRes{}

	fileExists, err := g.DB().Model("LectureFile").Where("fileId", req.FileId).Count()
	if err != nil {
		return nil, err
	}
	if fileExists == 0 {
		return nil, gerror.New("Lecture file not found")
	}

	var filePath string
	if err = g.DB().Model("Files").Where("id", req.FileId).Fields("storePath").Scan(&filePath); err != nil {
		return nil, err
	}

	if filePath != "" && gfile.Exists(filePath) {
		_ = gfile.Remove(filePath)
	}

	res.Result = true

	return res, nil
}
