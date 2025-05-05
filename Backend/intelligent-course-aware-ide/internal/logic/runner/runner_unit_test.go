package runner

import (
	"context"
	"testing"
	"time"

	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"
	"github.com/stretchr/testify/assert"

	v1 "intelligent-course-aware-ide/api/runner/v1"
	"intelligent-course-aware-ide/internal/consts"
)

func TestNew(t *testing.T) {
	answer := &Runners{}
	result := New()
	assert.Equal(t, answer, result)
}

func TestCCodeRunner(t *testing.T) {
	testcaseCodeInfo1 := v1.RunnerReq{
		Code: "test",
		Name: "1",
	}
	testcaseCodeInfo2 := v1.RunnerReq{
		Code: "test",
		Name: "1\\",
	}
	testcases := [2]v1.RunnerReq{
		testcaseCodeInfo1, testcaseCodeInfo2,
	}
	answers := [2][2]string{
		{consts.PathForDocker + testcaseCodeInfo1.Name + ".cpp", consts.PathForDocker + testcaseCodeInfo1.Name},
		{"", ""},
	}

	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()
	testRunner := New()
	for index, testcase := range testcases {
		result1, result2, err := testRunner.CCodeRunner(ctx, &testcase)
		t.Log(index, testcase, result1, result2, err)
		assert.Equal(t, answers[index][0], result1)
		assert.Equal(t, answers[index][1], result2)
	}
}

func TestPythonRunner(t *testing.T) {
	testcaseCodeInfo1 := v1.RunnerReq{
		Code: "test",
		Name: "1",
	}
	testcaseCodeInfo2 := v1.RunnerReq{
		Code: "test",
		Name: "1\\",
	}
	testcases := [2]v1.RunnerReq{
		testcaseCodeInfo1, testcaseCodeInfo2,
	}
	answers := [2]string{
		consts.PathForDocker + testcaseCodeInfo1.Name + ".py", "",
	}

	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()
	testRunner := New()
	for index, testcase := range testcases {
		result, err := testRunner.PythonCodeRunner(ctx, &testcase)
		t.Log(index, testcase, result, err)
		assert.Equal(t, answers[index], result)
	}
}
