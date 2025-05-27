package Files

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	"intelligent-course-aware-ide/api/Files/v1"
)

func (c *ControllerV1) GetNoteWithLectureId(ctx context.Context, req *v1.GetNoteWithLectureIdReq) (res *v1.GetNoteWithLectureIdRes, err error) {
	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
