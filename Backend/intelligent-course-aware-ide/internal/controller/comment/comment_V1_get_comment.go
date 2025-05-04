package comment

import (
	"context"

	V1 "intelligent-course-aware-ide/api/comment/V1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/do"
)

func (c *ControllerV1) GetComment(ctx context.Context, req *V1.GetCommentReq) (res *V1.GetCommentRes, err error) {
	res = &V1.GetCommentRes{}
	err = dao.Comment.Ctx(ctx).Where(do.Comment{
		LectureId: req.LectureId,
	}).Scan(&res.Comments)
	return
}
