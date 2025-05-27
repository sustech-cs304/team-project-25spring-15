FROM golang:1.23-bullseye

# 安装 curl 和其他工具
RUN apt-get update && apt-get install -y curl

# 安装官方 Docker CLI 二进制（示例用24.0.5版本）
RUN curl -fsSL https://download.docker.com/linux/static/stable/x86_64/docker-24.0.5.tgz -o docker.tgz \
    && tar --strip-components=1 -xvzf docker.tgz -C /usr/local/bin docker/docker \
    && rm docker.tgz

ENV GOPROXY=https://goproxy.cn,direct

# 设置工作目录
WORKDIR /app

# 拷贝 Go mod 文件，下载依赖
COPY go.mod go.sum ./
RUN go mod download

# 拷贝项目代码
COPY . .

# 编译程序
RUN CGO_ENABLED=1 GOOS=linux GOARCH=amd64 go build -o main main.go

CMD [ "sh", "-c", "./main > /usr/log/output.log" ]
