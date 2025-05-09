package middleware

import (
	"net/http"

	"intelligent-course-aware-ide/internal/consts"

	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/golang-jwt/jwt/v5"
)

func Auth(r *ghttp.Request) {
	var tokenString = r.Header.Get("Authorization")
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(consts.JWTKey), nil
	})
	if err != nil || !token.Valid {
		r.Response.WriteStatus(http.StatusForbidden)
		r.Exit()
	}
	r.Middleware.Next()
}
