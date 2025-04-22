package lecture

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	"intelligent-course-aware-ide/api/lecture/v1"
)

func (c *ControllerV1) UpdateLecture(ctx context.Context, req *v1.UpdateLectureReq) (res *v1.UpdateLectureRes, err error) {
	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
