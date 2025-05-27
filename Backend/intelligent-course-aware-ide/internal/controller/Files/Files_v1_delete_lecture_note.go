package Files

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	"intelligent-course-aware-ide/api/Files/v1"
)

func (c *ControllerV1) DeleteLectureNote(ctx context.Context, req *v1.DeleteLectureNoteReq) (res *v1.DeleteLectureNoteRes, err error) {
	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
