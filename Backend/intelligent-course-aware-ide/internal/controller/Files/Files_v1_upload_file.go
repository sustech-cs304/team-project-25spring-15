package Files

import (
	"context"
	"os"
	"path/filepath"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"

	v1 "intelligent-course-aware-ide/api/Files/v1"
	"intelligent-course-aware-ide/internal/consts"
)

func (c *ControllerV1) UploadFile(ctx context.Context, req *v1.UploadFileReq) (res *v1.UploadFileRes, err error) {
	res = &v1.UploadFileRes{}

	// save the file and get a path
	filePath := consts.PathForHost + "files/"
	if err := os.MkdirAll(filePath, 0755); err != nil {
		// Log detailed error for debugging
		return nil, gerror.Wrap(err, "Failed to create upload directory")
	}
	// generate a uniqueName with save.para2 = true
	uniqueName, err := req.File.Save(filePath, true)
	if err != nil {
		return nil, gerror.New("Failed to save file")
	}

	originalName := req.File.Filename
	fullPath := filepath.Join(filePath, uniqueName)
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

	// Insert into Files table
	insertRes, err2 := tx.Model("Files").Insert(g.Map{
		"fileSize": size,
		"fileUrl":  fullPath,
		"fileName": originalName,
		"fileType": ctype,
	})
	if err2 != nil {
		err = err2
		return nil, gerror.New("Insert fail")
	}
	newFileId, err2 := insertRes.LastInsertId()
	if err2 != nil {
		err = err2
		return
	}

	if err2 = tx.Commit(); err2 != nil {
		err = err2
		return
	}
	res.FileId = newFileId

	return res, nil
}
