package cmd

import (
	"context"
	"fmt"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/gogf/gf/v2/os/gcmd"

	"intelligent-course-aware-ide/internal/controller/Files"
	"intelligent-course-aware-ide/internal/controller/account"
	"intelligent-course-aware-ide/internal/controller/ai"
	"intelligent-course-aware-ide/internal/controller/assignment"
	"intelligent-course-aware-ide/internal/controller/chat"
	"intelligent-course-aware-ide/internal/controller/command2"
	"intelligent-course-aware-ide/internal/controller/comment"
	"intelligent-course-aware-ide/internal/controller/course"
	"intelligent-course-aware-ide/internal/controller/lecture"
	"intelligent-course-aware-ide/internal/controller/runner"
	"intelligent-course-aware-ide/internal/controller/user"
	"intelligent-course-aware-ide/internal/logic/middleware"
)

var (
	Main = gcmd.Command{
		Name:  "main",
		Usage: "main",
		Brief: "start http server",
		Func: func(ctx context.Context, parser *gcmd.Parser) (err error) {
			s := g.Server()

			s.BindMiddlewareDefault(middleware.MiddlewareCORS, func(r *ghttp.Request) {
				// 添加错误恢复机制
				defer func() {
					if err := recover(); err != nil {
						g.Log().Error(r.GetCtx(), "Panic recovered:", err)
						r.Response.WriteStatusExit(500, g.Map{
							"code":    500,
							"message": fmt.Sprintf("%v", err),
						})
					}
				}()

				r.Middleware.Next()

				// 检查请求处理后是否有错误
				if err := r.GetError(); err != nil {
					g.Log().Error(r.GetCtx(), "Error occurred:", err)
					r.Response.WriteJsonExit(g.Map{
						"code":    500,
						"message": err.Error(),
					})
				}
			})

			s.Group("/", func(group *ghttp.RouterGroup) {
				group.Middleware(ghttp.MiddlewareHandlerResponse)
				group.Middleware(middleware.LoggerMiddleware)
				group.Group("/", func(group *ghttp.RouterGroup) {
					group.Bind(
						account.NewV1(),
					)
					group.Group("/", func(group *ghttp.RouterGroup) {
						group.Middleware(middleware.Auth)
						group.Bind(
							ai.NewV1(),
							runner.NewV1(),
							course.NewV1(),
							Files.NewV1(),
							user.NewV1(),
							assignment.NewV1(),
							lecture.NewV1(),
							chat.NewV1(),
							comment.NewV1(),
							command2.NewV1(),
						)
					})
				})
			})

			s.Run()
			return nil
		},
	}
)
