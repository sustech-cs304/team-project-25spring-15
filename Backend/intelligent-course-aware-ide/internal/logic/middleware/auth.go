package middleware

import (
	"net/http"

	"intelligent-course-aware-ide/internal/consts"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/golang-jwt/jwt/v5"

	accountv1 "intelligent-course-aware-ide/api/account/v1"
)

func Auth(r *ghttp.Request) {
	tokenString := r.Header.Get("Authorization")

	tokenClaims, err := jwt.ParseWithClaims(tokenString, &accountv1.JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(consts.JWTKey), nil
	})

	if err != nil || !tokenClaims.Valid {
		r.Response.WriteStatus(http.StatusForbidden)
		r.Exit()
	}

	if claims, ok := tokenClaims.Claims.(*accountv1.JWTClaims); ok {
		cnt, err := g.DB().Model("users").Where(g.Map{"userId": claims.UserId, "login": 1}).Count()
		if err != nil || cnt != 1 {
			r.Response.WriteStatus(http.StatusInternalServerError)
			r.Exit()
		}
		r.SetCtxVar("operatorId", claims.UserId)
	}

	r.Middleware.Next()
}
