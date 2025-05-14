package course

import (
	"context"
	"strings"

	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/consts"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"

	"github.com/gogf/gf/frame/g"
)

func (c *ControllerV1) RecommendCourse(ctx context.Context, req *v1.RecommendCourseReq) (res *v1.RecommendCourseRes, err error) {
	operatorId := ctx.Value("operatorId").(int64)
	var userCourseInfos []*entity.UserCourseInfo
	err = dao.UserCourseInfo.Ctx(ctx).Where("userId", operatorId).Scan(&userCourseInfos)
	if err != nil {
		return nil, err
	}

	var keywords strings.Builder
	for _, studentCourseInfo := range userCourseInfos {
		var courseInfo v1.CourseInfoWithLecture
		err = dao.Courses.Ctx(ctx).WherePri(studentCourseInfo.CourseId).Scan(&courseInfo)
		if err != nil {
			return res, err
		}
		keywords.WriteString(courseInfo.CourseName)
		keywords.WriteString(",")
		keywords.WriteString(courseInfo.Description)
		keywords.WriteString(",")
	}
	keywordStr := strings.TrimRight(keywords.String(), ",")

	res = &v1.RecommendCourseRes{}
	err = g.DB().Raw("CALL fuzzy_search_result_multi(?, ?, ?)", keywordStr, "", consts.RecommendNum).Scan(&res.Courses)
	if err != nil || res.Courses == nil {
		return nil, err
	}
	return res, nil

}
