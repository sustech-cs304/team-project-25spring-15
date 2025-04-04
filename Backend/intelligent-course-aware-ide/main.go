package main

import (
	_ "intelligent-course-aware-ide/internal/packed"

	"github.com/gogf/gf/v2/os/gctx"

	"intelligent-course-aware-ide/internal/cmd"
)

func main() {
	cmd.Main.Run(gctx.GetInitCtx())
}
