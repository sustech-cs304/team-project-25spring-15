from flask import Flask
from routes import run_bp, check_bp, bash_bp

app = Flask(__name__)

# 注册蓝图
app.register_blueprint(run_bp)
app.register_blueprint(check_bp)
app.register_blueprint(bash_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001, debug=True)
