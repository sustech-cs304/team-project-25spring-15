#!/bin/bash
set -e

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

# Install lizard in venv
if ! pip show lizard &>/dev/null; then
  echo "Installing lizard..."
  pip install -i https://pypi.tuna.tsinghua.edu.cn/simple lizard
else
  echo "lizard already installed in virtual environment."
fi

echo "====== All tools installed successfully ======"
