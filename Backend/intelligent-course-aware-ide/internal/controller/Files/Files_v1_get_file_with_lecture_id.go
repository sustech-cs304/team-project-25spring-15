package Files

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"

	v1 "intelligent-course-aware-ide/api/Files/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) GetFileWithLectureId(ctx context.Context, req *v1.GetFileWithLectureIdReq) (res *v1.GetFileWithLectureIdRes, err error) {
	f, ferr := os.OpenFile("debug.log", os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0644)
	if ferr == nil {
		fmt.Fprintf(f, "%s Invoke GetFileWithLectureId\n", time.Now().Format("2006-01-02 15:04:05"))
		f.Close()
	}

	// 1. 从 LectureFiles 表里根据 lectureId 查出 fileId
	var fileId int64
	err = dao.LectureFiles.Ctx(ctx).
		Where("lectureId", req.LectureId).
		Fields("fileId").
		Scan(&fileId)
	if err != nil {
		return nil, gerror.Wrap(err, "查询 LectureFiles 失败")
	}
	if fileId == 0 {
		return nil, gerror.New("对应的文件不存在")
	}

	// 2. 从 Files 表根据 fileId 查出 fileUrl
	var fileUrl string
	err = dao.Files.Ctx(ctx).
		WherePri(fileId).
		Fields("fileUrl").
		Scan(&fileUrl)
	if err != nil {
		return nil, gerror.Wrap(err, "查询 Files 失败")
	}
	if fileUrl == "" {
		return nil, gerror.New("文件 URL 不存在")
	}

	r := g.RequestFromCtx(ctx)
	r.Response.ServeFileDownload(fileUrl)

	return nil, nil
}
