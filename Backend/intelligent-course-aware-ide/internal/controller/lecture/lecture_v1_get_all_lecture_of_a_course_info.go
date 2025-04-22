package lecture

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	"intelligent-course-aware-ide/api/lecture/v1"
)

func (c *ControllerV1) GetAllLectureOfACourseInfo(ctx context.Context, req *v1.GetAllLectureOfACourseInfoReq) (res *v1.GetAllLectureOfACourseInfoRes, err error) {
	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
