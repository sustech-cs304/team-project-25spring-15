package file

import (
	"context"
	"intelligent-course-aware-ide/internal/consts"
	"path/filepath"

	"github.com/gogf/gf/errors/gerror"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/gogf/gf/v2/util/guid"
)

type uploadFileImpl struct{}

func (s *uploadFileImpl) UploadFileFromHttp(ctx context.Context, File *ghttp.UploadFile) (string, error) {

	// Generate a unique file name and save it
	originalName := File.Filename
	ext := filepath.Ext(originalName)
	uniqueName := guid.S() + ext
	fullPath := filepath.Join(consts.PathForLecture, uniqueName)
	if _, err := File.Save(fullPath); err != nil {
		return "", gerror.New("Failed to save file")
	}

	return fullPath, nil
}
