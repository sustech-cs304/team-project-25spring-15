package comment

import (
	"context"
	"fmt"

	//"github.com/gogf/gf/v2/frame/g"
	v1 "intelligent-course-aware-ide/api/comment/v1"
	"intelligent-course-aware-ide/internal/dao"
	//"intelligent-course-aware-ide/internal/model/do"
)

func (c *ControllerV1) GetComment(ctx context.Context, req *v1.GetCommentReq) (res *v1.GetCommentRes, err error) {
	res = &v1.GetCommentRes{}
	err = dao.Comment.Ctx(ctx).As("c").
		LeftJoin(dao.Users.Table()+" as u1", "u1.userId = c.authorId").
		LeftJoin(dao.Comment.Table()+" as parent", "parent.authorId = c.repliedToCommentedId").
		LeftJoin(dao.Users.Table()+" as u2", "u2.userId = parent.authorId").
		Where("c.lectureId = ?", req.LectureId).
		Fields(`
		DISTINCT
        c.commentId as commentId,
        c.lectureId,
        c.authorId,
        c.repliedToCommentedId,
        c.content,
        c.createTime,
        c.likes,
        u1.username as AuthorName,
        u2.username as repliedToUserName
    `).Scan(&res.Comments)
	fmt.Println("Fetched Comments:", res.Comments)
	return res, err
}
