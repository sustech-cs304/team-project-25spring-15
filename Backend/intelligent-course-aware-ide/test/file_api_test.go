package test

import (
	"context"
	"mime/multipart"
	"net/textproto"
	"os"
	"path/filepath"
	"testing"

	v1 "intelligent-course-aware-ide/api/Files/v1"
	"intelligent-course-aware-ide/internal/controller/Files"
	"intelligent-course-aware-ide/internal/dao"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/gogf/gf/v2/test/gtest"
)

func Test_UploadLectureFile(t *testing.T) {
	// 1. 准备：在 Lectures 表插入一条记录以保证 lectureId 存在
	lectureId := int64(9999)
	_, err := dao.Lectures.Ctx(context.Background()).
		Data(g.Map{
			"lectureId":   lectureId,
			"courseId":    123,
			"lectureName": "测试讲义",
			"description": "单元测试插入",
		}).
		Insert()
	gtest.AssertNil(err)
	defer func() {
		// 清理：LectureFiles、Files、Lectures
		dao.LectureFiles.Ctx(context.Background()).
			Where("lectureId", lectureId).Delete()
		dao.Files.Ctx(context.Background()).
			Where("fileUrl LIKE ?", "%lectures%").Delete()
		dao.Lectures.Ctx(context.Background()).
			Where("lectureId", lectureId).Delete()
	}()

	// 2. 创建临时文件作为上传载体
	tmp, err := os.CreateTemp("", "upload-*.txt")
	gtest.AssertNil(err)
	_, err = tmp.WriteString("hello gf!")
	gtest.AssertNil(err)
	tmp.Close()
	defer os.Remove(tmp.Name())

	// 3. 构造 ghttp.UploadFile（注意 FileName 而不是 Filename）
	f, err := os.Open(tmp.Name())
	gtest.AssertNil(err)
	defer f.Close()
	gtest.AssertNil(err)

	fheader := &multipart.FileHeader{
		Filename: filepath.Base(tmp.Name()),
		Header:   textproto.MIMEHeader{"Content-Type": {"text/plain"}},
	}

	uploadFile := &ghttp.UploadFile{
		FileHeader: fheader,
	}

	// 4. 调用 UploadLectureFile 并断言
	req := &v1.UploadLectureFileReq{
		LectureId: lectureId,
		File:      uploadFile,
	}
	ctrl := &Files.ControllerV1{}

	gtest.C(t, func(t *gtest.T) {
		res, err := ctrl.UploadLectureFile(context.Background(), req)
		t.AssertNil(err)
		t.AssertGT(res.FileId, int64(0))

		// 验证 LectureFiles 里确实多了关联
		count, err2 := dao.LectureFiles.Ctx(context.Background()).
			Where("lectureId", lectureId).
			Where("fileId", res.FileId).
			Count()
		t.AssertNil(err2)
		t.AssertEQ(count, 1)
	})
}
