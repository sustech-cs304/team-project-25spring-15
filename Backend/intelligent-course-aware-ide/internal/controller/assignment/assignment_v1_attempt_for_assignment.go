package assignment

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"

	v1 "intelligent-course-aware-ide/api/assignment/v1"
	"intelligent-course-aware-ide/internal/consts"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/do"
	"intelligent-course-aware-ide/internal/model/entity"

	"github.com/gogf/gf/errors/gcode"
	"github.com/gogf/gf/errors/gerror"
)

func (c *ControllerV1) AttemptForAssignment(ctx context.Context, req *v1.AttemptForAssignmentReq) (res *v1.AttemptForAssignmentRes, err error) {
	if req.AssignmentUserAttempt.FileId == 0 || req.AssignmentUserAttempt.Code == "" {
		path := consts.PathForDocker + "user/" + strconv.FormatInt(req.AssignmentUserAttempt.AssignmentId, 10) + "/" + "attempt." + req.AssignmentUserAttempt.FileType
		err = os.WriteFile(path, []byte(req.AssignmentUserAttempt.Code), 0644)
		if err != nil {
			fmt.Println("Write Fail:", err)
			return
		}
		req.AssignmentUserAttempt.FileId, err = dao.Files.Ctx(ctx).Data(do.Files{
			FileUrl: path,
		}).InsertAndGetId()

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
	for _, testcaseAndAnswerFile := range testcaseAndAnswerList {
		var testcase, answer entity.Files
		err = dao.Files.Ctx(ctx).WherePri(testcaseAndAnswerFile.TestcaseId).Scan(&testcase)
		if err != nil {
			return nil, err
		}
		testcases = append(testcases, testcase)
		err = dao.Files.Ctx(ctx).WherePri(testcaseAndAnswerFile.TestcaseId).Scan(&answer)
		if err != nil {
			return nil, err
		}
		answers = append(answers, answer)
	}

	requestBody := map[string]interface{}{
		"codePath":   codeFile.FileUrl,
		"type":       req.AssignmentUserAttempt.FileType,
		"testcases":  testcases,
		"answers":    answers,
		"outputPath": "user/" + strconv.FormatInt(req.AssignmentUserAttempt.UserId, 10) + "/" + "assignment/" + strconv.FormatInt(req.AssignmentUserAttempt.AssignmentId, 10) + "/",
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

	return &resResult, nil
}
