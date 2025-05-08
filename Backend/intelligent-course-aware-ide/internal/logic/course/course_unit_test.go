package course

import (
	"context"
	"testing"
	"time"

	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"
	"github.com/stretchr/testify/assert"
)

func TestNew(t *testing.T) {
	answer := &Courses{}
	result := New()
	assert.Equal(t, answer, result)
}

func TestCheckUserHasFullPermissionOfCourse(t *testing.T) {
	testcases := [6][2]int64{
		{1, 1},
		{2, 1},
		{3, 1},
		{5, 1},
		{999, 1},
		{1, 2},
	}
	answers := [6]bool{
		true, true, false, false, false, false,
	}
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()
	testCourse := New()
	for index, testcase := range testcases {
		result, err := testCourse.CheckUserHasFullPermissionOfCourse(ctx, testcase[0], testcase[1])
		t.Log(index, testcase, result, err)
		assert.Equal(t, answers[index], result)
	}
}

func TestCheckUserHasHalfPermissionOfCourse(t *testing.T) {
	testcases := [5][2]int64{
		{1, 1},
		{2, 1},
		{3, 1},
		{5, 1},
		{6, 1},
	}
	answers := [5]bool{
		false, false, true, false, false,
	}
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()
	testCourse := New()
	for index, testcase := range testcases {
		result, err := testCourse.CheckUserHasHalfPermissionOfCourse(ctx, testcase[0], testcase[1])
		t.Log(index, testcase, result, err)
		assert.Equal(t, answers[index], result)
	}
}
