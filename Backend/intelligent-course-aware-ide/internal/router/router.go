package router

import (
	"intelligent-course-aware-ide/internal/controller/sharedFile"

	"github.com/gogf/gf/v2/net/ghttp"
)

func RegisterRouter(s *ghttp.Server) {
	controller := new(sharedFile.ControllerV1)

	// 共享文件WebSocket路由
	s.BindHandler("/ws/sharedFile/connect", controller.HandleSharedFileConnect)

	// 共享文件API路由
	s.Group("/api", func(group *ghttp.RouterGroup) {

		group.Bind(
			controller.UpdateSharedFile,
			controller.GetSharedFileContent,
		)
	})
}
