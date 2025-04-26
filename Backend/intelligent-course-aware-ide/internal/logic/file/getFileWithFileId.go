package file

import (
	"context"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (f *Files) GetFileWithFileId(ctx context.Context, fileId int64) (file *entity.Files, err error) {
	err = dao.Files.Ctx(ctx).WherePri(fileId).Scan(&file)
	return file, err
}
