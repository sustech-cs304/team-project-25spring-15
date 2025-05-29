package file

import (
	"context"

	"github.com/gogf/gf/v2/net/ghttp"
)

// ChangeEntry Indicates that a change to a line in a document is recorded once
type ChangeEntry struct {
	Line     int    `json:"line"`
	Position int    `json:"position"`
	Old      string `json:"old"`
	New      string `json:"new"`
}

// The business interface to the change log file
type CreateLogFile interface {
	// CreateChangeLog receives multiple ChangeEntries and creates files that are stored locally in the ./logs directory.
	// and stores the path to the file in the database, returning the file ID of the new record in the database
	CreateChangeLog(ctx context.Context) (int64, error)
}

// NewFileLogic returns an implementation of IFileLogic.
func CreateFileLogic() CreateLogFile {
	return &createfileLogicImpl{}
}

type UploadFile interface {
	UploadFileFromHttp(ctx context.Context, File *ghttp.UploadFile) (string, error)
}

func UploadFileImpl() UploadFile {
	return &uploadFileImpl{}
}
