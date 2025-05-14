package course

import (
	"context"

	"github.com/gogf/gf/frame/g"

	v1 "intelligent-course-aware-ide/api/course/v1"
)

func (c *ControllerV1) SearchCourse(ctx context.Context, req *v1.SearchCourseReq) (res *v1.SearchCourseRes, err error) {
	res = &v1.SearchCourseRes{}
	err = g.DB().Raw("CALL fuzzy_search_result_multi(?, ?, ?)", req.Keywords, req.SourceTable, req.RecommendNum).Scan(&res.Courses)
	if err != nil || res.Courses == nil {
		return nil, err
	}
	return res, nil
}
