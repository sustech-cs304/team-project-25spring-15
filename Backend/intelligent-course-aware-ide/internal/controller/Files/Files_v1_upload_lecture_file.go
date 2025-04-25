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

// UploadLectureFile implements the API for uploading lecture files
func (c *ControllerV1) UploadLectureFile(ctx context.Context, req *v1.UploadLectureFileReq) (res *v1.UploadLectureFileRes, err error) {
	res = &v1.UploadLectureFileRes{}

	// Check if lecture exists and belongs to the course
	lectureExists, err := g.DB().Model("Lectures").Where("lectureId", req.LectureId).Count()
	if err != nil {
		return nil, err
	}
	if lectureExists == 0 {
		return nil, gerror.New("Lecture not found")
	}

	// Generate a unique file name
	originalName := req.File.Filename
	fileExt := filepath.Ext(originalName)
	uniqueFileName := guid.S() + fileExt

	// Set up storage directory
	uploadPath := g.Cfg().MustGet(ctx, "upload.path", "./uploads").String()
	storagePath := filepath.Join(uploadPath, "lectures", gtime.Date())

	// Create directory if it doesn't exist
	if !gfile.Exists(storagePath) {
		if err = gfile.Mkdir(storagePath); err != nil {
			return nil, gerror.New("Failed to create storage directory")
		}
	}

	// Full file path
	filePath := filepath.Join(storagePath, uniqueFileName)

	// Save the file
	if _, err = req.File.Save(filePath); err != nil {
		return nil, gerror.New("Failed to save file")
	}

	// Get file size
	fileSize := req.File.Size

	// Start database transaction
	tx, err := g.DB().Begin(ctx)
	if err != nil {
		return nil, err
	}

	// Ensure transaction rolls back on error
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	// Insert the file into Files table
	fileInsertResult, err := tx.Model("Files").Insert(g.Map{
		"fileName":      originalName,
		"storePath":     filePath,
		"fileSize":      fileSize,
		"fileType":      req.File.Header.Get("Content-Type"),
		"uploadTime":    time.Now(),
		"relatedModule": "lecture",
	})
	if err != nil {
		return nil, err
	}

	// Get the newly inserted file ID
	fileId, err := fileInsertResult.LastInsertId()
	if err != nil {
		return nil, err
	}

	// Insert into LectureFiles table to establish the relationship
	_, err = tx.Model("LectureFiles").Insert(g.Map{
		"fileId":    fileId,
		"lectureId": req.LectureId,
	})
	if err != nil {
		return nil, err
	}

	// Commit the transaction
	if err = tx.Commit(); err != nil {
		return nil, err
	}

	// Return the file information
	res.FileId = fileId

	return res, nil
}
