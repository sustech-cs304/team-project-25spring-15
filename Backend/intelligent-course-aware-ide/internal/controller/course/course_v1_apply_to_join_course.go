package course

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	"intelligent-course-aware-ide/api/course/v1"
)

func (c *ControllerV1) ApplyToJoinCourse(ctx context.Context, req *v1.ApplyToJoinCourseReq) (res *v1.ApplyToJoinCourseRes, err error) {
	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
