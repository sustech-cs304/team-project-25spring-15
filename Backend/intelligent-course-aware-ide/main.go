package main

import (
	_ "intelligent-course-aware-ide/internal/packed"

	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"

	_ "intelligent-course-aware-ide/internal/logic"

	"github.com/gogf/gf/v2/os/gctx"

	"intelligent-course-aware-ide/internal/cmd"
)

func main() {
	cmd.Main.Run(gctx.GetInitCtx())
}
