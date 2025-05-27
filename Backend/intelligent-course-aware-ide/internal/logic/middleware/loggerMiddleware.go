package middleware

import (
	"bytes"
	"io"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
)

func LoggerMiddleware(r *ghttp.Request) {
	ctx := r.GetCtx()

	// 1. 打印请求方法和路径
	g.Log().Infof(ctx, "Request: %s %s", r.Method, r.URL.Path)

	// 2. 打印请求头
	g.Log().Debugf(ctx, "Headers: %v", r.Header)

	// 3. 打印查询参数
	if query := r.GetQueryMap(); len(query) > 0 {
		g.Log().Debugf(ctx, "Query: %v", query)
	}

	// 4. 打印表单参数
	if form := r.GetFormMap(); len(form) > 0 {
		g.Log().Debugf(ctx, "Form: %v", form)
	}

	// 5. 打印请求体（只在可能有 Body 时才读）
	if r.Method == "POST" || r.Method == "PUT" || r.Method == "PATCH" || r.Method == "DELETE" {
		body, err := io.ReadAll(r.Body)
		if err == nil && len(body) > 0 {
			g.Log().Debugf(ctx, "Body: %s", string(body))
			r.Request.Body = io.NopCloser(bytes.NewBuffer(body))
		} else if err != nil {
			g.Log().Warningf(ctx, "Failed to read body: %v", err)
		}
	}

	g.Log().Debugf(ctx, "")
	// 放行请求
	r.Middleware.Next()
}
