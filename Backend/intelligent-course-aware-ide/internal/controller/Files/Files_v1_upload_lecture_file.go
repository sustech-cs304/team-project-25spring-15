package Files

import (
	"context"
	"path/filepath"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gfile"
	"github.com/gogf/gf/v2/os/gtime"
	"github.com/gogf/gf/v2/util/guid"

	v1 "intelligent-course-aware-ide/api/Files/v1"
)

// the API for uploading lecture files
func (c *ControllerV1) UploadLectureFile(ctx context.Context, req *v1.UploadLectureFileReq) (res *v1.UploadLectureFileRes, err error) {
	res = &v1.UploadLectureFileRes{}

	lectureExists, err := g.DB().Model("Lectures").Where("lectureId", req.LectureId).Count()
	if err != nil {
		return nil, err
	}
	if lectureExists == 0 {
		return nil, gerror.New("Lecture not found")
	}

	// Generate a unique file name
	originalName := req.File.Filename
	req.File.Filename = guid.S() + req.File.Filename

	uploadPath := g.Cfg().MustGet(ctx, "upload.path", "./uploads").String()
	storagePath := filepath.Join(uploadPath, "lectures", gtime.Date())

	if !gfile.Exists(storagePath) {
		if err = gfile.Mkdir(storagePath); err != nil {
			return nil, gerror.New("Failed to create storage directory")
		}
	}

	fileUrl := filepath.Join(storagePath, req.File.Filename)

	if _, err = req.File.Save(storagePath); err != nil {
		return nil, gerror.New("Failed to save file")
	}

	fileSize := req.File.Size

	tx, err := g.DB().Begin(ctx)
	if err != nil {
		g.Log().Error(ctx, err)
		return nil, err
	}

	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	fileInsertResult, err := tx.Model("Files").Insert(g.Map{
		"fileSize": fileSize,
		"fileUrl":  fileUrl,
		"fileName": originalName,
		"fileType": req.File.Header.Get("Content-Type"),
	})
	if err != nil {
		return nil, err
	}

	fileId, err := fileInsertResult.LastInsertId()
	if err != nil {
		return nil, err
	}

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

	res.FileId = fileId

	return res, nil
}
