package course

import (
	"context"

	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) GetAllCoursesInfo(ctx context.Context, req *v1.GetAllCoursesInfoReq) (res *v1.GetAllCoursesInfoRes, err error) {
	res = &v1.GetAllCoursesInfoRes{}
	err = dao.Courses.Ctx(ctx).Scan(&res.Courses)
	return res, err
}
