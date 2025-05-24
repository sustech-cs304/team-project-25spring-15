package main

import (
	"context"
	"github.com/gogf/gf/os/glog"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gctx"

	_ "intelligent-course-aware-ide/internal/logic"
	_ "intelligent-course-aware-ide/internal/packed"

	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"

	"intelligent-course-aware-ide/internal/cmd"
)

func init() {
	// 设置日志级别为 ALL，确保所有日志都能输出
	g.Log().SetLevel(glog.LEVEL_ALL)

	// 强制日志输出到控制台
	g.Log().SetStdoutPrint(true)

	// 输出一条测试日志确认配置生效
	g.Log().Debug(context.Background(), "日志系统初始化完成")

	// go boot.StartRedisSubscriber()
}

func main() {
	cmd.Main.Run(gctx.GetInitCtx())
}
