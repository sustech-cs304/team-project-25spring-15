package assignment

import (
	"context"
	"errors"
	assignmentv1 "intelligent-course-aware-ide/api/assignment/v1"
	runnerV1 "intelligent-course-aware-ide/api/runner/v1"
	"intelligent-course-aware-ide/internal/dao"
	runnerLogic "intelligent-course-aware-ide/internal/logic/runner"
	"intelligent-course-aware-ide/internal/model/entity"
	"os/exec"
	"path/filepath"
	"strings"
)

func (a *Assignments) CheckAnswer(ctx context.Context, runners *runnerLogic.Runners, attemptForAssignment *assignmentv1.AttemptForAssignment, codeFile *entity.Files, testcaseAndAnswerFile *entity.TestcaseAndAnswerFiles, befScore int, totalScore int) (count int, allScore int, err error) {
	var testcaseFile, answerFile *entity.Files
	err = dao.Files.Ctx(ctx).WherePri(testcaseAndAnswerFile.TestcaseId).Scan(&testcaseFile)
	if err != nil || testcaseFile == nil {
		return befScore, totalScore, err
	}
	err = dao.Files.Ctx(ctx).WherePri(testcaseAndAnswerFile.AnswerId).Scan(&answerFile)
	if err != nil || answerFile == nil {
		return befScore, totalScore, err
	}

	totalScore += testcaseAndAnswerFile.Score

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

	var dockerId string
	dockerId, err = runners.GetTargetContainerID(attemptForAssignment.FileType)
	if err != nil {
		return befScore, totalScore, err
	}
	if attemptForAssignment.FileType == "c" || attemptForAssignment.FileType == "c++" || attemptForAssignment.FileType == "cpp" {
		_, err = runners.RunCCode(ctx, &codeRunnerReq, dockerId, codeFile.FileUrl, executableFilePath)
		if err != nil {
			return befScore, totalScore, err
		}
	} else if attemptForAssignment.FileType == "python" {
		_, err = runners.RunPythonCode(ctx, &codeRunnerReq, dockerId, codeFile.FileUrl)
		if err != nil {
			return befScore, totalScore, err
		}
	} else if attemptForAssignment.FileType == "string" {
		codeRunnerReq.OutputPath = codeFile.FileUrl
	} else {
		return befScore, totalScore, errors.New("only c/cpp and python are support to run")
	}

	var stdout, stderr strings.Builder
	cmd := exec.CommandContext(ctx, "docker", "exec", dockerId, "diff", "-b", "-B", codeRunnerReq.OutputPath, answerFile.FileUrl)
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	cmd.Run()
	if stderr.String() != "" {
		return befScore, totalScore, errors.New(stderr.String())
	} else if stdout.String() == "" {
		befScore += testcaseAndAnswerFile.Score
	}
	return befScore, totalScore, nil
}
