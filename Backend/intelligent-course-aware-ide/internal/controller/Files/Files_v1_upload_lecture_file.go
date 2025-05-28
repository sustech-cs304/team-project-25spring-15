package Files

import (
	"context"
	"os"
	"path/filepath"
	"time"

	v1 "intelligent-course-aware-ide/api/Files/v1"
	"intelligent-course-aware-ide/internal/consts"
	"intelligent-course-aware-ide/internal/dao"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gfile"
	"github.com/gogf/gf/v2/util/gconv"
)

// UploadLectureFile handles both new uploads and replacements based on existing fileId lookup.
func (c *ControllerV1) UploadLectureFile(ctx context.Context, req *v1.UploadLectureFileReq) (res *v1.UploadLectureFileRes, err error) {
	res = &v1.UploadLectureFileRes{}

	// Check if lecture exists
	lectureCount, err := dao.Lectures.Ctx(ctx).
		Where("lectureId", req.LectureId).
		Count()
	if err != nil {
		return nil, err
	}
	if lectureCount == 0 {
		return nil, gerror.New("Lecture not found")
	}

	// Queries if there is already a file association
	idValue, err := dao.LectureFiles.Ctx(ctx).
		Where("lectureId", req.LectureId).
		Value("fileId")
	if err != nil {
		return nil, err
	}
	existingFileId := gconv.Int64(idValue) // 0 表示无记录

	// save the file and get a path
	if err := os.MkdirAll(consts.PathForLecture, 0755); err != nil {
		// Log detailed error for debugging
		return nil, gerror.Wrap(err, "Failed to create upload directory")
	}
	// generate a uniqueName with save.para2 = true
	uniqueName, err := req.File.Save(consts.PathForLecture, true)
	if err != nil {
		return nil, gerror.New("Failed to save file")
	}

	originalName := req.File.Filename
	fullPath := filepath.Join(consts.PathForLecture, uniqueName)
	size := req.File.Size
	ctype := req.File.Header.Get("Content-Type")

	// Starting a database transaction
	tx, err := g.DB().Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	// New file upload
	if existingFileId == 0 {

		// Insert into Files table
		insertRes, err2 := tx.Model("Files").Insert(g.Map{
			"fileSize": size,
			"fileUrl":  fullPath,
			"fileName": originalName,
			"fileType": ctype,
		})
		if err2 != nil {
			err = err2
			return
		}
		newFileId, err2 := insertRes.LastInsertId()
		if err2 != nil {
			err = err2
			return
		}

		if _, err2 = tx.Model("LectureFiles").Insert(g.Map{
			"lectureId": req.LectureId,
			"fileId":    newFileId,
		}); err2 != nil {
			err = err2
			return
		}

		if err2 = tx.Commit(); err2 != nil {
			err = err2
			return
		}
		res.FileId = newFileId

	} else {
		// ===== Replacement update process =====

		// Retrieve the old fileUrl
		oldValue, err2 := dao.Files.Ctx(ctx).
			Where("fileId", existingFileId).
			Value("fileUrl")
		if err2 != nil {
			err = err2
			return
		}
		oldPath := gconv.String(oldValue)

		// Updating the Files table
		if _, err2 = tx.Model("Files").
			Where("fileId", existingFileId).
			Update(g.Map{
				"fileName":   originalName,
				"fileUrl":    fullPath,
				"fileSize":   size,
				"fileType":   ctype,
				"uploadTime": time.Now(),
			}); err2 != nil {
			err = err2
			return
		}

		// Submission of transactions
		if err2 = tx.Commit(); err2 != nil {
			err = err2
			return
		}

		// Delete old files (ignore errors)
		if oldPath != "" && gfile.Exists(oldPath) {
			_ = gfile.Remove(oldPath)
		}
		res.FileId = existingFileId
	}

	return res, nil
}
