package assignment

import (
	"context"
	"errors"
	"os/exec"
	"path/filepath"
	"strings"

	v1 "intelligent-course-aware-ide/api/assignment/v1"
	runnerV1 "intelligent-course-aware-ide/api/runner/v1"
	"intelligent-course-aware-ide/internal/controller/runner"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (c *ControllerV1) AttemptForAssignment(ctx context.Context, req *v1.AttemptForAssignmentReq) (res *v1.AttemptForAssignmentRes, err error) {
	var codeFile *entity.Files
	var testcaseAndAnswerList []*entity.TestcaseAndAnswerFiles
	err = dao.Files.Ctx(ctx).WherePri(req.AssignmentUserAttempt.FileId).Scan(&codeFile)
	if err != nil {
		return nil, err
	}
	err = dao.TestcaseAndAnswerFiles.Ctx(ctx).Where("assignmentId", req.AssignmentUserAttempt.AssignmentId).Scan(&testcaseAndAnswerList)
	if err != nil {
		return nil, err
	}

	count := 0

	for _, testcaseAndAnswerFile := range testcaseAndAnswerList {
		var testcaseFile, answerFile *entity.Files
		err = dao.Files.Ctx(ctx).WherePri(testcaseAndAnswerFile.TestcaseId).Scan(&testcaseFile)
		if err != nil {
			return nil, err
		}
		err = dao.Files.Ctx(ctx).WherePri(testcaseAndAnswerFile.AnswerId).Scan(&answerFile)
		if err != nil {
			return nil, err
		}

		// Todo: Check whether the result is correct
		dir := filepath.Dir(codeFile.FileUrl)
		base := filepath.Base(codeFile.FileUrl)
		ext := filepath.Ext(base)
		name := strings.TrimSuffix(base, ext)

		// Use answerFile extend name as extend name
		base = filepath.Base(answerFile.FileUrl)
		ext = filepath.Ext(base)
		executableFilePath := filepath.Join(dir, name)

		// Here docker is running in ubuntu
		executableFilePath = filepath.ToSlash(executableFilePath)

		outputPath := executableFilePath + "_latest" + ext
		codeRunnerReq := runnerV1.RunnerReq{
			InputPath:  testcaseFile.FileUrl,
			OutputPath: outputPath,
		}

		var dockerName string
		if req.AssignmentUserAttempt.FileType == "c" || req.AssignmentUserAttempt.FileType == "c++" || req.AssignmentUserAttempt.FileType == "cpp" {
			_, err = runner.RunCCode(ctx, &codeRunnerReq, codeFile.FileUrl, executableFilePath)
			if err != nil {
				return nil, err
			}
			dockerName = runner.TargetCDockerName
		} else if req.AssignmentUserAttempt.FileType == "python" {
			_, err = runner.RunPythonCode(ctx, &codeRunnerReq, codeFile.FileUrl)
			if err != nil {
				return nil, err
			}
			dockerName = runner.TargetPythonDockerName
		} else if req.AssignmentUserAttempt.FileType == "string" {
			dockerName = runner.TargetDockerName
			codeRunnerReq.OutputPath = codeFile.FileUrl
		} else {
			return nil, errors.New("only c/cpp and python are support to run")
		}

		var stdout, stderr strings.Builder
		cmd := exec.CommandContext(ctx, "docker", "exec", dockerName, "diff", "-b", "-B", codeRunnerReq.OutputPath, answerFile.FileUrl)
		cmd.Stdout = &stdout
		cmd.Stderr = &stderr
		cmd.Run()
		if stderr.String() != "" {
			return nil, errors.New(stderr.String())
		} else if stdout.String() == "" {
			count += 1
		}
	}

	score := (float32(count) / float32(len(testcaseAndAnswerList))) * 100
	assignmentUserFeedback := v1.FeedbackForAssignmentInfo{
		AssignmentId: req.AssignmentUserAttempt.AssignmentId,
		PerformerId:  req.AssignmentUserAttempt.UserId,
		Score:        int(score),
		FileId:       req.AssignmentUserAttempt.FileId,
		FileType:     req.AssignmentUserAttempt.FileType,
	}
	res = &v1.AttemptForAssignmentRes{
		AssignmentUserFeedback: assignmentUserFeedback,
	}

	res.AssignmentUserFeedback.FeedbackId, err = dao.AssignmentUserFeedback.Ctx(ctx).Data(assignmentUserFeedback).InsertAndGetId()
	return res, err
}
