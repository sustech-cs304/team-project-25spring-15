package user

import (
	"testing"

	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"
	"github.com/stretchr/testify/assert"
)

func TestNew(t *testing.T) {
	testUser := &Users{}
	resultUser := New()
	assert.Equal(t, testUser, resultUser)
}
