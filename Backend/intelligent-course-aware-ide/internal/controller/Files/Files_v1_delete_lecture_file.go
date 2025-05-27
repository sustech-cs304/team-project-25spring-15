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

	// Begin transaction
	tx, err := g.DB().Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	// Check existence in LectureFiles table
	count, err := tx.Model("LectureFiles").
		Where("fileId", req.FileId).
		Count()
	if err != nil {
		return nil, err
	}
	if count == 0 {
		return nil, gerror.New("Lecture file not found")
	}

	// Retrieve old file path before deletion
	var filePath string
	if err = tx.Model("Files").
		Where("fileId", req.FileId).
		Fields("fileUrl").
		Scan(&filePath); err != nil {
		return nil, err
	}

	// Delete the record from LectureFiles
	if _, err = tx.Model("LectureFiles").
		Where("fileId", req.FileId).
		Delete(); err != nil {
		return nil, gerror.New("Failed to delete lecture-file association")
	}

	// Delete the record from Files
	if _, err = tx.Model("Files").
		Where("fileId", req.FileId).
		Delete(); err != nil {
		return nil, gerror.New("Failed to delete file metadata")
	}

	// Commit transaction
	if err = tx.Commit(); err != nil {
		return nil, err
	}

	// Finally, remove the physical file (ignore errors)
	if filePath != "" && gfile.Exists(filePath) {
		_ = gfile.Remove(filePath)
	}

	res.Result = true
	return res, nil
}
