package sharedFile

import (
	"context"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"

	v1 "intelligent-course-aware-ide/api/sharedFile/v1"
)

func (c *ControllerV1) SharedFileUserGetIn(ctx context.Context, req *v1.SharedFileUserGetInReq) (res *v1.SharedFileUserGetInRes, err error) {
	res = &v1.SharedFileUserGetInRes{}
	// check if the file exists
	fileExists, err := g.DB().Model("Files").Where("fileId", req.FileId).Count()
	if err != nil {
		return nil, err
	}
	if fileExists == 0 {
		return nil, gerror.New("Lecture not found")
	}

	// insert into database
	tx, err := g.DB().Begin(ctx)
	if err != nil {
		g.Log().Error(ctx, err)
		return nil, err
	}

	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()
	_, err = tx.Model("SharedFilePartners").Insert(g.Map{
		"sharedFileId": req.FileId,
		"userId":       req.UserId,
		"isOnline":     false,
		"isManager":    false,
	})
	if err != nil {
		return nil, err
	}

	return res, nil
}
