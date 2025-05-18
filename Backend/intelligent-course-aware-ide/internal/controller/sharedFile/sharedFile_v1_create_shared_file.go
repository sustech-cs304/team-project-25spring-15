package sharedFile

import (
	"context"

	"github.com/gogf/gf/database/gdb"
	"github.com/gogf/gf/frame/g"
	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	v1 "intelligent-course-aware-ide/api/sharedFile/v1"
	"intelligent-course-aware-ide/internal/logic/file"
)

func (c *ControllerV1) CreateSharedFile(ctx context.Context, req *v1.CreateSharedFileReq) (res *v1.CreateSharedFileRes, err error) {
	// Use transactions to ensure that both sharedFiles and sharedFilePartners tables either succeed or are rolled back at the same time.
	err = g.DB().Transaction(ctx, func(ctx context.Context, tx *gdb.TX) error {
		sharedFileId := req.FileId
		sharedLogId, err := file.CreateFileLogic().CreateChangeLog(ctx)
		if err != nil {
			return gerror.WrapCodef(gcode.CodeInternalError, err, "Failed to generate SharedLogId")
		}

		tx, err = g.DB().Begin()
		if err != nil {
			g.Log().Error(ctx, err)
			return gerror.WrapCodef(gcode.CodeDbOperationError, err, "Failure to set DB")
		}

		defer func() {
			if err != nil {
				tx.Rollback()
			}
		}()

		// 2. Insert a row into the sharedFiles table
		_, err = tx.Model("SharedFiles").Insert(g.Map{
			"sharedFileId": sharedFileId,
			"sharedLogId":  sharedLogId,
		})
		if err != nil {
			return gerror.WrapCodef(gcode.CodeDbOperationError, err, "Failure to create a shared document record")
		}

		// 3. Insert the creator (the first participant) into the sharedFilePartners table and mark it as an administrator.
		_, err = tx.Model("SharedFilePartners").Insert(g.Map{
			"sharedFileId": sharedFileId,
			"userId":       req.UserId,
			"isOnline":     false,
			"isManager":    true,
		})
		if err != nil {
			return gerror.WrapCodef(gcode.CodeDbOperationError, err, "Failure to create a manager partner record")
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	return &v1.CreateSharedFileRes{}, nil
}
