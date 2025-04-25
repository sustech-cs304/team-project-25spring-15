package Files

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	v1 "intelligent-course-aware-ide/api/Files/v1"
)

func (c *ControllerV1) UploadFile(ctx context.Context, req *v1.UploadLectureFileReq) (res *v1.UploadLectureFileRes, err error) {
	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
