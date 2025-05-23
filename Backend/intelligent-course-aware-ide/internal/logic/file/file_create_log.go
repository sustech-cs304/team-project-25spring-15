package file

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gfile"
	"github.com/gogf/gf/v2/os/gtime"
	"github.com/gogf/gf/v2/util/guid"
)

type createfileLogicImpl struct{}

// CreateChangeLog Implementation of change log file creation and database persistence
func (s *createfileLogicImpl) CreateChangeLog(ctx context.Context) (int64, error) {
	// 1. Preparing the log storage directory
	logsRoot := g.Cfg().MustGet(ctx, "logs.path", "./logs").String()
	dateDir := gtime.Date()
	dir := filepath.Join(logsRoot, dateDir)
	if !gfile.Exists(dir) {
		if err := gfile.Mkdir(dir); err != nil {
			return 0, fmt.Errorf("Failed to create log directory: %w", err)
		}
	}

	// 2. Generate log's name and create files
	logName := guid.S() + ".log"
	fullPath := filepath.Join(dir, logName)
	f, err := os.Create(fullPath)
	if err != nil {
		return 0, fmt.Errorf("Failed to create log file: %w", err)
	}
	defer f.Close()

	// 3. Persistence to database
	tx, err := g.DB().Begin(ctx)
	if err != nil {
		return 0, err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	result, err := tx.Model("Files").Insert(g.Map{
		"fileName": logName,
		"fileUrl":  fullPath,
		"fileSize": 0,
		"fileType": "text/plain",
	})
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	if err = tx.Commit(); err != nil {
		return 0, err
	}

	return id, nil
}
