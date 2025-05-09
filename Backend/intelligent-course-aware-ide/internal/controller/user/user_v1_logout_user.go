package user

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"

	v1 "intelligent-course-aware-ide/api/user/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) LogoutUser(ctx context.Context, req *v1.LogoutUserReq) (res *v1.LogoutUserRes, err error) {
	operatorId := ctx.Value("operatorId").(int64)
	_, err = dao.Users.Ctx(ctx).Where("userId", operatorId).Update(g.Map{"login": 0})
	if err != nil {
		return nil, err
	}
	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
