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

	tx, err := g.DB().Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	fileExists, err := g.DB().Model("LectureFile").Where("fileId", req.FileId).Count()
	if err != nil {
		return nil, err
	}
	if fileExists == 0 {
		return nil, gerror.New("Lecture file not found")
	}

	// delete the record from (table)LectureFiles
	if _, err = tx.Model("LectureFile").Where("fileId", req.FileId).Delete(); err != nil {
		return nil, gerror.New("Failed to delete lecture file record")
	}

	// delete the record from (table)Files
	if _, err = tx.Model("Files").Where("fileId", req.FileId).Delete(); err != nil {
		return nil, gerror.New("Failed to delete file record")
	}

	var filePath string
	if err = g.DB().Model("Files").Where("fileId", req.FileId).Fields("storePath").Scan(&filePath); err != nil {
		return nil, err
	}

	if filePath != "" && gfile.Exists(filePath) {
		_ = gfile.Remove(filePath)
	}

	if err = tx.Commit(); err != nil {
		return nil, err
	}

	res.Result = true
	return res, nil
}
