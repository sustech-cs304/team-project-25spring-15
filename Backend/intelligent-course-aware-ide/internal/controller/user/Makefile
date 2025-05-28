.PHONY: test-coverage

test-coverage:
	go test -coverprofile=coverage.out ./...
	grep -v "user_new.go" coverage.out > coverage_filtered.out
	go tool cover -html=coverage_filtered.out