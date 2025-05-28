package file

import (
	"context"
	"intelligent-course-aware-ide/internal/consts"
	"os"

	"github.com/gogf/gf/errors/gerror"
	"github.com/gogf/gf/v2/net/ghttp"
)

type uploadFileImpl struct{}

func (s *uploadFileImpl) UploadFileFromHttp(ctx context.Context, File *ghttp.UploadFile) (string, error) {

	// save the file and get a path
	if err := os.MkdirAll(consts.PathForLecture, 0755); err != nil {
		// Log detailed error for debugging
		return "", gerror.Wrap(err, "Failed to create upload directory")
	}
	// generate a uniqueName with save.para2 = true
	uniqueName, err := File.Save(consts.PathForLecture, true)
	if err != nil {
		return "", gerror.New("Failed to save file")
	}

	return uniqueName, nil
}
