FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y python3 python3-pip g++ && apt-get clean && rm -rf /var/lib/apt/lists/*

# 软链接方便用python命令
RUN ln -s /usr/bin/python3 /usr/bin/python

CMD ["bash", "-c", "while true; do sleep 1000; done"]