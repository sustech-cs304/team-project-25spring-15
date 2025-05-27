package test
import (
	"context"
	"intelligent-course-aware-ide/api/comment/v1"
	"intelligent-course-aware-ide/internal/controller/comment"
	"testing"

	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"
	"github.com/gogf/gf/v2/test/gtest"
)
func Test_CreateComment(t *testing.T){
	newcomment := v1.CommentInfo{
		LectureId: 1,
		AuthorId: 1,
		Content: "我是爱你的",
		CreateTime: "2025-05-25 19:28",
		Likes: 1,
	}
	req :=&v1.CreateCommentReq{
		NewComment: newcomment,
	}
	ctrl :=&comment.ControllerV1{}
	gtest.C(t,func(t *gtest.T) {
		res,err := ctrl.CreateComment(context.Background(),req)
		t.AssertNil(err)
		t.Assert(res.CommentId,1)
	})
}
func Test_GetComment(t *testing.T){
	req :=&v1.GetCommentReq{
		LectureId: 1,
	}
	ctrl :=&comment.ControllerV1{}
	gtest.C(t,func(t *gtest.T) {
		res,err :=ctrl.GetComment(context.Background(),req)
		t.AssertNil(err)
		t.Assert(res.Comments[0].Content,"我是爱你的")
	})
}
func Test_UpdateComment(t *testing.T){
	req :=&v1.UpdateCommentReq{
		UserId: 1,
		CommentId: 1,
		Likes: 100,
	}
	ctrl :=&comment.ControllerV1{}
	gtest.C(t,func(t *gtest.T) {
		res,err := ctrl.UpdateComment(context.Background(),req)
		t.AssertNil(err)
		t.Assert(res.Success,true)
	})
}

func Test_DeleteComment(t *testing.T){
	req :=&v1.DeleteCommentReq{
		CommentId: 1,
		UserId: 1,
	}
	ctrl :=&comment.ControllerV1{}
	gtest.C(t,func(t *gtest.T) {
		res,err :=ctrl.DeleteComment(context.Background(),req)
		t.AssertNil(err)
		t.Assert(res.Success,true)
	})
}