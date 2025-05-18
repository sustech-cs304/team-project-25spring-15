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
		return nil, gerror.New("file not found")
	}

	// check if the user exists
	userExists, err := g.DB().Model("Users").Where("userId", req.UserId).Count()
	if err != nil {
		return nil, err
	}
	if userExists == 0 {
		return nil, gerror.New("user not found")
	}

	// check if the user is the partner of the sharedFile
	partnerExists, err := g.DB().Model("SharedFilePartners").Where("userId", req.UserId).Count()
	if err != nil {
		return nil, err
	}
	if partnerExists != 0 {
		return nil, gerror.New("user has been a partner")
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

	// Commit the transaction
	if err = tx.Commit(); err != nil {
		return nil, err
	}

	return res, nil
}
