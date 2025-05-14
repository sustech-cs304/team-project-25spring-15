package course

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	"intelligent-course-aware-ide/api/course/v1"
)

func (c *ControllerV1) RecommandCourse(ctx context.Context, req *v1.RecommandCourseReq) (res *v1.RecommandCourseRes, err error) {
	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
