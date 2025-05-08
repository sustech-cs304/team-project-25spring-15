package comment

import (
	"context"

	"intelligent-course-aware-ide/api/comment/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/do"
)

func (c *ControllerV1) GetComment(ctx context.Context, req *v1.GetCommentReq) (res *v1.GetCommentRes, err error) {
	res = &v1.GetCommentRes{}
	err = dao.Comment.Ctx(ctx).Where(do.Comment{
		LectureId: req.LectureId,
	}).Scan(&res.Comments)
	return
}
