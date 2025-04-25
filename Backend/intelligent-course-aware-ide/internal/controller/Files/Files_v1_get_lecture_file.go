package Files

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	"intelligent-course-aware-ide/api/Files/v1"
)

func (c *ControllerV1) GetLectureFile(ctx context.Context, req *v1.GetLectureFileReq) (res *v1.GetLectureFileRes, err error) {
	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
