#!/bin/bash
set -ex

echo "====== Create and activate Python environment ======"
VENV_DIR="./venv"
if [ ! -d "$VENV_DIR" ]; then
  echo "Virtual environment not found. Creating one at $VENV_DIR ..."
  python3 -m venv "$VENV_DIR"
else
  echo "Virtual environment already exists at $VENV_DIR"
fi
source "$VENV_DIR/bin/activate"

echo "====== Install dependencies ======"
# Install cloc
if ! command -v cloc &>/dev/null; then
  echo "Installing cloc..."
  sudo apt update
  sudo apt install -y cloc
else
  echo "cloc already installed."
fi

# Install jq
if ! command -v jq &>/dev/null; then
  echo "Installing jq..."
  sudo apt install -y jq
else
  echo "jq already installed."
fi

# Install node and npm
if ! command -v npm &>/dev/null; then
  echo "Installing Node.js and npm..."
  sudo apt install -y nodejs npm
else
  echo "Node.js and npm already installed."
fi

if ! command -v go &>/dev/null; then
  echo "Go not found. Installing Go..."
  GO_VERSION="1.22.0"
  GO_TARBALL="go${GO_VERSION}.linux-amd64.tar.gz"
  wget https://golang.org/dl/${GO_TARBALL}
  sudo rm -rf /usr/local/go
  sudo tar -C /usr/local -xzf ${GO_TARBALL}
  rm ${GO_TARBALL}
  export PATH=$PATH:/usr/local/go/bin
  echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
else
  echo "Go already installed."
fi

# Install gocyclo
if ! command -v gocyclo &>/dev/null; then
  echo "Installing gocyclo..."
  go install github.com/fzipp/gocyclo/cmd/gocyclo@latest
  export PATH=$PATH:$HOME/go/bin
  echo 'export PATH=$PATH:$HOME/go/bin' >> ~/.bashrc
else
  echo "gocyclo already installed."
fi

# Install lizard in venv
if ! pip show lizard &>/dev/null; then
  echo "Installing lizard..."
  pip install -i https://pypi.tuna.tsinghua.edu.cn/simple lizard
else
  echo "lizard already installed in virtual environment."
fi

echo "====== Evaluate Backend Code ======"
BACKEND_DIR="./Backend/intelligent-course-aware-ide"

if [ -d "$BACKEND_DIR" ]; then
  echo "-- Lines of Code (Go):"
  cloc "$BACKEND_DIR"

  echo "-- Cyclomatic Complexity (Go):"
  gocyclo -over 5 "$BACKEND_DIR" || true

  echo "-- Number of Go Files:"
  find "$BACKEND_DIR" -name "*.go" | wc -l

  echo "-- Go Dependencies:"
  if [ -f "$BACKEND_DIR/go.mod" ]; then
    echo "-- Required Modules:"
    go list -m all | wc -l
  else
    echo "No go.mod file found"
  fi
else
  echo "Backend directory $BACKEND_DIR not found"
fi

echo "====== Analyzing Frontend Code ======"
FRONTEND_DIR="./Frontend/nextjs-dashboard"
if [ -d "$FRONTEND_DIR" ]; then
  echo "-- Lines of Code (Next.js):"
  cloc "$FRONTEND_DIR"

  echo "-- Number of JS/TS Files:"
  find "$FRONTEND_DIR" \( -name "*.js" -o -name "*.ts" -o -name "*.tsx" \) | wc -l

  echo "-- Cyclomatic Complexity (JS/TS):"
  lizard "$FRONTEND_DIR" -l javascript -l typescript

  echo "-- Number of NPM Dependencies:"
  if [ -f "$FRONTEND_DIR/package.json" ]; then
    jq '.dependencies, .devDependencies | keys | length' "$FRONTEND_DIR/package.json" | paste -sd+ - | bc
  else
    echo "No package.json file found"
  fi
else
  echo "Frontend directory $FRONTEND_DIR not found"
fi