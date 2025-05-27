# Makefile

# Develop part
.PHONY: setup-backend-dev close-backend-dev

# Analyze part
.PHONY: all-analyze
.PHONY: setup-analyze venv install-tools install-go install-gocyclo install-lizard
.PHONY: analyze analyze-backend analyze-frontend
# Analyze backend:
.PHONY: count-lines calc-complexity count-go-files count-deps

VENV_DIR := ./venv
DEV_COMPOSE_DIR := ./Backend
DEV_COMPOSE_NAME := docker-compose.dev.yml
BACKEND_DIR := ./Backend/intelligent-course-aware-ide
FRONTEND_DIR := ./Frontend/nextjs-dashboard

# ====== Setup develop
setup-backend-dev:
	@cd $(DEV_COMPOSE_DIR) && docker compose -f $(DEV_COMPOSE_NAME) up -d --build

close-backend-dev:
	@cd $(DEV_COMPOSE_DIR) && docker compose -f $(DEV_COMPOSE_NAME) down

# ====== Setup analyze environment and analyze
all-analyze: setup-analyze analyze

# ====== Setup analyze environment
setup-analyze: venv install-tools install-go install-gocyclo install-lizard

venv:
	@if [ ! -d $(VENV_DIR) ]; then \
		echo "Creating Python virtual environment..."; \
		python3 -m venv $(VENV_DIR); \
	else \
		echo "Virtual environment already exists."; \
	fi
	@. $(VENV_DIR)/bin/activate

install-tools:
	@which cloc >/dev/null || (echo "Installing cloc..." && sudo apt update && sudo apt install -y cloc)
	@which jq >/dev/null || (echo "Installing jq..." && sudo apt install -y jq)
	@which npm >/dev/null || (echo "Installing Node.js and npm..." && sudo apt install -y nodejs npm)

install-go:
	@which go >/dev/null || ( \
		echo "Installing Go..."; \
		wget https://golang.org/dl/go1.22.0.linux-amd64.tar.gz; \
		sudo rm -rf /usr/local/go; \
		sudo tar -C /usr/local -xzf go1.22.0.linux-amd64.tar.gz; \
		rm go1.22.0.linux-amd64.tar.gz; \
		echo 'export PATH=$$PATH:/usr/local/go/bin' >> ~/.bashrc; \
	)

install-gocyclo:
	@which gocyclo >/dev/null || ( \
		echo "Installing gocyclo..."; \
		go install github.com/fzipp/gocyclo/cmd/gocyclo@latest; \
		echo 'export PATH=$$PATH:$$HOME/go/bin' >> ~/.bashrc; \
	)

install-lizard:
	@. $(VENV_DIR)/bin/activate && pip show lizard >/dev/null || ( \
		echo "Installing lizard..."; \
		. $(VENV_DIR)/bin/activate && pip install -i https://pypi.tuna.tsinghua.edu.cn/simple lizard; \
	)

# ====== Analyze
analyze: analyze-backend analyze-frontend

analyze-backend:
	@echo "Analyzing Backend Code..."
	$(MAKE) count-lines
	$(MAKE) calc-complexity
	$(MAKE) count-go-files
	$(MAKE) count-deps

count-lines:
	@echo "-- Lines of Code (Go):"
	@cloc $(BACKEND_DIR)

calc-complexity:
	@echo "-- Cyclomatic Complexity (Go):"
	@gocyclo -over 5 $(BACKEND_DIR) || true

count-go-files:
	@echo "-- Number of Go Files:"
	@find $(BACKEND_DIR) -name "*.go" | wc -l

count-deps:
	@if [ -f $(BACKEND_DIR)/go.mod ]; then \
		echo "-- Go Dependencies:"; \
		go list -m all | wc -l; \
	else \
		echo "No go.mod file found"; \
	fi