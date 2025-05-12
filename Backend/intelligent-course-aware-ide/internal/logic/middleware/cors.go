package middleware

import "github.com/gogf/gf/v2/net/ghttp"

func MiddlewareCORS(r *ghttp.Request) {
	r.Response.Header().Set("Access-Control-Allow-Origin", "*")
	r.Response.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	r.Response.Header().Set("Access-Control-Allow-Headers", "*")
	r.Response.Header().Set("Access-Control-Allow-Credentials", "false")

	if r.Method == "OPTIONS" {
		r.Exit()
	}

	r.Middleware.Next()
}
