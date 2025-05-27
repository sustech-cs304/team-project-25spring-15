# Makefile
.PHONY: all setup venv install-tools install-go install-gocyclo install-lizard \
        analyze analyze-backend analyze-frontend

VENV_DIR := ./venv
BACKEND_DIR := ./Backend/intelligent-course-aware-ide
FRONTEND_DIR := ./Frontend/nextjs-dashboard

all: setup analyze

# ===== Setup Environment =====

setup: venv install-tools install-go install-gocyclo install-lizard

venv:
	@if [ ! -d $(VENV_DIR) ]; then \
		echo "Creating Python virtual environment..."; \
		python3 -m venv $(VENV_DIR); \
	else \
		echo "Virtual environment already exists."; \
	fi
	@source $(VENV_DIR)/bin/activate

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

# ===== Analyze =====

analyze: analyze-backend analyze-frontend

analyze-backend:
	@if [ -d $(BACKEND_DIR) ]; then \
		echo "Analyzing Backend Code..."; \
		cloc $(BACKEND_DIR); \
		gocyclo -over 5 $(BACKEND_DIR) || true; \
		find $(BACKEND_DIR) -name "*.go" | wc -l; \
		if [ -f $(BACKEND_DIR)/go.mod ]; then go list -m all | wc -l; else echo "No go.mod file."; fi; \
	else \
		echo "Backend directory $(BACKEND_DIR) not found"; \
	fi

analyze-frontend:
	@if [ -d $(FRONTEND_DIR) ]; then \
		echo "Analyzing Frontend Code..."; \
		cloc $(FRONTEND_DIR); \
		find $(FRONTEND_DIR) \( -name "*.js" -o -name "*.ts" -o -name "*.tsx" \) | wc -l; \
		. $(VENV_DIR)/bin/activate && lizard $(FRONTEND_DIR) -l javascript -l typescript; \
		if [ -f $(FRONTEND_DIR)/package.json ]; then \
			jq '.dependencies, .devDependencies | keys | length' $(FRONTEND_DIR)/package.json | paste -sd+ - | bc; \
		else \
			echo "No package.json file."; \
		fi \
	else \
		echo "Frontend directory $(FRONTEND_DIR) not found"; \
	fi
