FROM python:3.11-slim

# 安装 g++ 编译器
RUN apt-get update && apt-get install -y g++ && apt-get clean && rm -rf /var/lib/apt/lists/*

# 使用清华 PyPI 镜像加速安装
RUN pip install --upgrade pip -i https://pypi.tuna.tsinghua.edu.cn/simple \
 && pip install flask gunicorn -i https://pypi.tuna.tsinghua.edu.cn/simple

WORKDIR /app
COPY . .

CMD [ "sh", "-c", "python app.py > /usr/log/runner-output.log" ]
