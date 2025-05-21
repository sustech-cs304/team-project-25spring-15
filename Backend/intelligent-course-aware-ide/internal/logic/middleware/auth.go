package middleware

import (
	"net/http"
	"strings"

	"intelligent-course-aware-ide/internal/consts"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/golang-jwt/jwt/v5"

	accountv1 "intelligent-course-aware-ide/api/account/v1"
)

func Auth(r *ghttp.Request) {
	authHeader := r.Header.Get("Authorization")
	if !strings.HasPrefix(authHeader, "Bearer ") {
		r.Response.WriteStatus(http.StatusUnauthorized)
		r.Response.WriteJson(g.Map{"error": "Authorization header must start with 'Bearer '"})
		r.Exit()
		return
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	tokenClaims, err := jwt.ParseWithClaims(tokenString, &accountv1.JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(consts.JWTKey), nil
	})
	if err != nil || !tokenClaims.Valid {
		r.Response.WriteStatus(http.StatusForbidden)
		r.Response.WriteJson(g.Map{"error": "Invalid or expired token"})
		r.Exit()
		return
	}

	if claims, ok := tokenClaims.Claims.(*accountv1.JWTClaims); ok {
		cnt, err := g.DB().Model("Users").Where(g.Map{
			"userId": claims.UserId,
			"login":  1,
		}).Count()
		if err != nil || cnt != 1 {
			r.Response.WriteStatus(http.StatusUnauthorized)
			r.Response.WriteJson(g.Map{"error": "User not logged in or does not exist"})
			r.Exit()
			return
		}
		r.SetCtxVar("operatorId", claims.UserId)
		r.SetCtxVar("operatorName", claims.UserName)
	}

	r.Middleware.Next()
}
