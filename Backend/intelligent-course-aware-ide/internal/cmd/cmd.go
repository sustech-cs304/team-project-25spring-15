package cmd

import (
	"context"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/gogf/gf/v2/os/gcmd"

	"intelligent-course-aware-ide/internal/controller/assignment"
	"intelligent-course-aware-ide/internal/controller/chat"
	"intelligent-course-aware-ide/internal/controller/course"
	"intelligent-course-aware-ide/internal/controller/example"
	"intelligent-course-aware-ide/internal/controller/lecture"
	"intelligent-course-aware-ide/internal/controller/runner"
	"intelligent-course-aware-ide/internal/controller/user"
	"intelligent-course-aware-ide/internal/controller/comment"
)

var (
	Main = gcmd.Command{
		Name:  "main",
		Usage: "main",
		Brief: "start http server",
		Func: func(ctx context.Context, parser *gcmd.Parser) (err error) {
			s := g.Server()
			s.Group("/", func(group *ghttp.RouterGroup) {
				group.Middleware(ghttp.MiddlewareHandlerResponse)
				group.Bind(
					example.NewV1(),
					runner.NewV1(),
					course.NewV1(),
					user.NewV1(),
					assignment.NewV1(),
					lecture.NewV1(),
					chat.NewV1(),
					comment.NewV1(),
				)
			})
			s.Run()
			return nil
		},
	}
)
