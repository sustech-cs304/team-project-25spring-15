package sharedFile

import (
	"context"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"

	v1 "intelligent-course-aware-ide/api/sharedFile/v1"
)

func (c *ControllerV1) SharedFileUserGetOut(ctx context.Context, req *v1.SharedFileUserGetOutReq) (res *v1.SharedFileUserGetOutRes, err error) {
	res = &v1.SharedFileUserGetOutRes{}

	tx, err := g.DB().Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

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
	if partnerExists == 0 {
		return nil, gerror.New("user is not a partner")
	}

	// remove the partner out of the sharedFile
	if _, err = tx.Model("SharedFilePartners").Where("sharedFileId", req.FileId).Delete(); err != nil {
		return nil, gerror.New("Failed to delete the partner")
	}
	if err != nil {
		return nil, err
	}

	// Commit the transaction
	if err = tx.Commit(); err != nil {
		return nil, err
	}

	return res, nil
}
