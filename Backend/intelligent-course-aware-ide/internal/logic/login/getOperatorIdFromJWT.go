package login

import (
	"context"

	loginv1 "intelligent-course-aware-ide/api/login/v1"
	"intelligent-course-aware-ide/internal/consts"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/golang-jwt/jwt/v5"
)

func (l *Logins) GetOperatorIdFromJWT(ctx context.Context) (operatorId int64, err error) {
	tokenString := g.RequestFromCtx(ctx).Request.Header.Get("Authorization")
	tokenClaims, _ := jwt.ParseWithClaims(tokenString, &loginv1.JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(consts.JWTKey), nil
	})

	if claims, ok := tokenClaims.Claims.(*loginv1.JWTClaims); ok && tokenClaims.Valid {
		operatorId = claims.UserId
	}
	return
}
