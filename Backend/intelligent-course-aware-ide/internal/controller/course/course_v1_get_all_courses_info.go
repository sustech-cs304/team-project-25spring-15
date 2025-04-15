package course

import (
	"context"

	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (c *ControllerV1) GetAllCoursesInfo(ctx context.Context, req *v1.GetAllCoursesInfoReq) (res *v1.GetAllCoursesInfoRes, err error) {
	res = &v1.GetAllCoursesInfoRes{}
	var courses []*entity.Courses
	err = dao.Courses.Ctx(ctx).Scan(&courses)
	return
}
