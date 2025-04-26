package assignment

import (
	"context"
	"errors"
	assignmentv1 "intelligent-course-aware-ide/api/assignment/v1"
	runnerV1 "intelligent-course-aware-ide/api/runner/v1"
	"intelligent-course-aware-ide/internal/controller/runner"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"
	"os/exec"
	"path/filepath"
	"strings"
)

func (a *Assignments) CheckAnswer(ctx context.Context, attemptForAssignment *assignmentv1.AttemptForAssignment, codeFile *entity.Files, testcaseAndAnswerFile *entity.TestcaseAndAnswerFiles, befScore int, totalScore int) (count int, allScore int, err error) {
	var testcaseFile, answerFile *entity.Files
	err = dao.Files.Ctx(ctx).WherePri(testcaseAndAnswerFile.TestcaseId).Scan(&testcaseFile)
	if err != nil {
		return befScore, totalScore, err
	}
	err = dao.Files.Ctx(ctx).WherePri(testcaseAndAnswerFile.AnswerId).Scan(&answerFile)
	if err != nil {
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

	var dockerName string
	if attemptForAssignment.FileType == "c" || attemptForAssignment.FileType == "c++" || attemptForAssignment.FileType == "cpp" {
		_, err = runner.RunCCode(ctx, &codeRunnerReq, codeFile.FileUrl, executableFilePath)
		if err != nil {
			return befScore, totalScore, err
		}
		dockerName = runner.TargetCDockerName
	} else if attemptForAssignment.FileType == "python" {
		_, err = runner.RunPythonCode(ctx, &codeRunnerReq, codeFile.FileUrl)
		if err != nil {
			return befScore, totalScore, err
		}
		dockerName = runner.TargetPythonDockerName
	} else if attemptForAssignment.FileType == "string" {
		dockerName = runner.TargetDockerName
		codeRunnerReq.OutputPath = codeFile.FileUrl
	} else {
		return befScore, totalScore, errors.New("only c/cpp and python are support to run")
	}

	var stdout, stderr strings.Builder
	cmd := exec.CommandContext(ctx, "docker", "exec", dockerName, "diff", "-b", "-B", codeRunnerReq.OutputPath, answerFile.FileUrl)
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
