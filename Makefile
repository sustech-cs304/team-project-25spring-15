# Makefile
MAKEFLAGS += --no-print-directory

# Dev part
.PHONY: setup-backend-dev close-backend-dev

# Ope part
.PHONY: setup-backend-ope close-backend-dev

# Analyze part
.PHONY: all-analyze
.PHONY: setup-analyze venv install-tools install-go install-gocyclo install-lizard
.PHONY: analyze analyze-backend analyze-frontend
# Analyze backend:
.PHONY: count-lines calc-complexity count-go-files count-deps


VENV_DIR := ./venv
DEV_COMPOSE_DIR := ./Backend
DEV_COMPOSE_NAME := docker-compose.dev.yml
OPE_COMPOSE_NAME := docker-compose.ope.yml
BACKEND_DIR := ./Backend/
TMP_DIR := ./Backend/data/tmp
BACKEND_GO_DIR := ./Backend/intelligent-course-aware-ide
BACKEND_PYTHON_DIR := ./Backend/code-runner
FRONTEND_DIR := ./Frontend/nextjs-dashboard

# ====== Setup dev
setup-backend-dev:
	@mkdir -p $(TMP_DIR)
	@cd $(DEV_COMPOSE_DIR) && docker compose -f $(DEV_COMPOSE_NAME) up -d --build

close-backend-dev:
	@cd $(DEV_COMPOSE_DIR) && docker compose -f $(DEV_COMPOSE_NAME) down

# ====== Setup ope
setup-backend-ope:
	@mkdir -p $(TMP_DIR)
	@cd $(DEV_COMPOSE_DIR) && \
	docker compose -f $(DEV_COMPOSE_NAME) build && \
	( docker info --format '{{.Swarm.LocalNodeState}}' | grep -q 'active' || docker swarm init ) && \
	docker stack deploy -c $(OPE_COMPOSE_NAME) CS304
close-backend-ope:
	@cd $(DEV_COMPOSE_DIR) && docker stack rm CS304

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

# ====== Analyze backend
analyze-backend:
	@echo "Analyzing Backend Code..."
	@$(MAKE) count-lines
	@$(MAKE) calc-complexity
	@$(MAKE) count-go-files
	@$(MAKE) count-deps

count-lines:
	@echo "-- Lines of Code (Go):"
	@cloc $(BACKEND_DIR)
	@echo ""

calc-complexity:
	@echo "-- Cyclomatic Complexity:"
	@gocyclo -over 0 $(BACKEND_DIR) | \
	awk '{count[$$1]++; sum+=$$1; total++} \
	END { \
		if (total > 0) printf("Average Complexity: %.2f\n", sum/total); else print "Average Complexity: N/A"; \
		for (c in count) printf("%s %d\n", c, count[c]); \
	}' | sort -n -k1,1 | \
	awk 'NR==1{print;next} {printf("Complexity %s: %d functions\n", $$1, $$2)}'
	@echo ""

count-go-files:
	@echo "-- Number of Go Files:"
	@find $(BACKEND_DIR) -name "*.go" | wc -l
	@echo ""

count-deps:
	@if [ -f $(BACKEND_GO_DIR)/go.mod ]; then \
		echo "-- Go Dependencies:"; \
		cd $(BACKEND_GO_DIR) && go list -m all | wc -l; \
	else \
		echo "No go.mod file found"; \
	fi
	@echo ""
	@if [ -f $(BACKEND_PYTHON_DIR)/requirements.txt ]; then \
		echo "-- Python Dependencies:"; \
		cd $(BACKEND_PYTHON_DIR) && grep -v '^\s*#' requirements.txt | grep -v '^\s*$$' | wc -l;\
	else \
		echo "No requirements.txt found"; \
	fi
	@echo ""

# ====== Analyze frontend
analyze-frontend: 
	@if [ -d $(FRONTEND_DIR) ]; then \
		echo "Analyzing Frontend Code..."; \
		cloc $(FRONTEND_DIR) --exclude-dir=.next,node_modules; \
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