package assignment

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	v1 "intelligent-course-aware-ide/api/assignment/v1"
	"intelligent-course-aware-ide/internal/consts"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/do"
	"intelligent-course-aware-ide/internal/model/entity"

	"github.com/gogf/gf/errors/gcode"
	"github.com/gogf/gf/errors/gerror"
	"github.com/gogf/gf/util/guid"
)

func (c *ControllerV1) AttemptForAssignment(ctx context.Context, req *v1.AttemptForAssignmentReq) (res *v1.AttemptForAssignmentRes, err error) {
	if req.AssignmentUserAttempt.FileId == 0 || req.AssignmentUserAttempt.Code != "" {
		path := consts.PathForHost + "user/" + strconv.FormatInt(req.AssignmentUserAttempt.AssignmentId, 10) + "/"
		err = os.MkdirAll(filepath.Dir(path), 0755)
		if err != nil {
			fmt.Println("Failed to create directory:", err)
			return
		}
		name := guid.S() + "." + req.AssignmentUserAttempt.FileType
		path = path + name
		err = os.WriteFile(path, []byte(req.AssignmentUserAttempt.Code), 0644)
		if err != nil {
			fmt.Println("Write Fail:", err)
			return
		}
		fileInfo, err := os.Stat(path)
		if err != nil {
			return nil, err
		}

		req.AssignmentUserAttempt.FileId, err = dao.Files.Ctx(ctx).Data(do.Files{
			FileUrl:  consts.PathForDocker + "user/" + strconv.FormatInt(req.AssignmentUserAttempt.AssignmentId, 10) + "/" + name,
			FileName: name,
			FileType: req.AssignmentUserAttempt.FileType,
			FileSize: fileInfo.Size(),
		}).InsertAndGetId()
		if err != nil {
			return nil, err
		}
	}

	var codeFile *entity.Files
	err = dao.Files.Ctx(ctx).WherePri(req.AssignmentUserAttempt.FileId).Scan(&codeFile)
	if err != nil {
		return nil, err
	}
	var testcaseAndAnswerList []*entity.TestcaseAndAnswerFiles
	err = dao.TestcaseAndAnswerFiles.Ctx(ctx).Where("assignmentId", req.AssignmentUserAttempt.AssignmentId).Scan(&testcaseAndAnswerList)
	if err != nil {
		return nil, err
	}

	var testcases, answers []entity.Files
	var scores []int
	for _, testcaseAndAnswerFile := range testcaseAndAnswerList {
		var testcase, answer entity.Files
		err = dao.Files.Ctx(ctx).WherePri(testcaseAndAnswerFile.TestcaseId).Scan(&testcase)
		if err != nil {
			return nil, err
		}
		relativePath := strings.TrimPrefix(testcase.FileUrl, consts.PathForHost)
		testcase.FileUrl = consts.PathForDocker + relativePath
		testcases = append(testcases, testcase)
		err = dao.Files.Ctx(ctx).WherePri(testcaseAndAnswerFile.AnswerId).Scan(&answer)
		if err != nil {
			return nil, err
		}
		relativePath = strings.TrimPrefix(answer.FileUrl, consts.PathForHost)
		answer.FileUrl = consts.PathForDocker + relativePath
		answers = append(answers, answer)
		scores = append(scores, testcaseAndAnswerFile.Score)
	}

	requestBody := map[string]interface{}{
		"codePath":   codeFile.FileUrl,
		"type":       req.AssignmentUserAttempt.FileType,
		"testcases":  testcases,
		"answers":    answers,
		"scores":     scores,
		"outputPath": guid.S(),
	}
	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return nil, gerror.NewCode(gcode.CodeInternalError, "Failed to marshal request body")
	}
	resp, err := http.Post(consts.TargetUrl+"/check", "application/json", bytes.NewBuffer(jsonData))

	if err != nil {
		return nil, gerror.NewCode(gcode.CodeInternalError, "Failed to send request to runner service")
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, gerror.NewCode(gcode.CodeInternalError, "Failed to read response body")
	}
	if resp.StatusCode != http.StatusOK {
		return nil, gerror.NewCode(gcode.CodeInternalError, string(body))
	}

	var resResult v1.AttemptForAssignmentRes
	err = json.Unmarshal(body, &resResult)
	if err != nil {
		return nil, gerror.NewCode(gcode.CodeInternalError, "Failed to unmarshal response body")
	}

	_, err = dao.AssignmentUserFeedback.Ctx(ctx).Data(do.AssignmentUserFeedback{
		AssignmentId: req.AssignmentUserAttempt.AssignmentId,
		FileId:       codeFile.FileId,
		PerformerId:  ctx.Value("operatorId").(int64),
		Score:        resResult.AssignmentUserFeedback.Score,
		Record:       resResult.AssignmentUserFeedback.Record,
		FileType:     req.AssignmentUserAttempt.FileType,
	}).Insert()

	return &resResult, err
}
