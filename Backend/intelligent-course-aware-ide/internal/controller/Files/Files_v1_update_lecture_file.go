package Files

import (
	"context"
	"path/filepath"
	"time"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gfile"
	"github.com/gogf/gf/v2/os/gtime"
	"github.com/gogf/gf/v2/util/guid"

	v1 "intelligent-course-aware-ide/api/Files/v1"
)

func (c *ControllerV1) UpdateLectureFile(ctx context.Context, req *v1.UpdateLectureFileReq) (res *v1.UpdateLectureFileRes, err error) {
	res = &v1.UpdateLectureFileRes{}

	fileExists, err := g.DB().Model("LectureFiles").Where("fileId", req.FileId).Count()
	if err != nil {
		return nil, err
	}
	if fileExists == 0 {
		return nil, gerror.New("Lecture file not found")
	}

	// Generate a unique file Path
	originalName := req.File.Filename
	fileExt := filepath.Ext(originalName)
	uniqueFileName := guid.S() + fileExt

	uploadPath := g.Cfg().MustGet(ctx, "upload.path", "./uploads").String()
	storagePath := filepath.Join(uploadPath, "lectures", gtime.Date())

	if !gfile.Exists(storagePath) {
		if err = gfile.Mkdir(storagePath); err != nil {
			return nil, gerror.New("Failed to create storage directory")
		}
	}

	filePath := filepath.Join(storagePath, uniqueFileName)

	// Save the file
	if _, err = req.File.Save(filePath); err != nil {
		return nil, gerror.New("Failed to save file")
	}

	fileSize := req.File.Size

	var oldFilePath string
	if err = g.DB().Model("Files").Where("id", req.FileId).Fields("storePath").Scan(&oldFilePath); err != nil {
		return nil, err
	}

	// database transaction
	tx, err := g.DB().Begin(ctx)
	if err != nil {
		return nil, err
	}

	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	_, err = tx.Model("Files").Where("id", req.FileId).Update(g.Map{
		"fileName":   originalName,
		"storePath":  filePath,
		"fileSize":   fileSize,
		"fileType":   req.File.Header.Get("Content-Type"),
		"uploadTime": time.Now(),
	})
	if err != nil {
		return nil, err
	}

	if err = tx.Commit(); err != nil {
		return nil, err
	}

	if oldFilePath != "" && gfile.Exists(oldFilePath) {
		_ = gfile.Remove(oldFilePath)
	}

	res.FileId = req.FileId

	return res, nil
}
