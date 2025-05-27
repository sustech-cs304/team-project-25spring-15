FROM golang:1.23-bullseye

ENV GOPROXY=https://goproxy.cn,direct

WORKDIR /app

RUN apt-get update && apt-get install -y docker.io


# 拷贝 go.mod 和 go.sum，提前下载依赖加速构建缓存
COPY go.mod go.sum ./
RUN go mod download

# 拷贝项目文件
COPY . .

# 编译程序，开启 CGO
RUN CGO_ENABLED=1 GOOS=linux GOARCH=amd64 go build -o main main.go

CMD ["./main"]
