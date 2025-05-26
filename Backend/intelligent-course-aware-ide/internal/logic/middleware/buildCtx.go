package middleware

import (
	"context"
	"errors"
	accountv1 "intelligent-course-aware-ide/api/account/v1"
	"intelligent-course-aware-ide/internal/consts"

	"github.com/golang-jwt/jwt/v5"
)

func BuildCtx(tokenString string) (ctx context.Context, err error) {
	tokenClaims, err := jwt.ParseWithClaims(tokenString, &accountv1.JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(consts.JWTKey), nil
	})
	if claims, ok := tokenClaims.Claims.(*accountv1.JWTClaims); ok {
		ctx = context.Background()
		ctx = context.WithValue(ctx, "operatorId", claims.UserId)
		ctx = context.WithValue(ctx, "operatorName", claims.UserName)
		return ctx, nil
	}
	return nil, errors.New("unknown error")
}
