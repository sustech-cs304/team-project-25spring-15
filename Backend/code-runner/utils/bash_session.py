import subprocess
import os
import signal

# 用于持久化 subprocess.Popen 对象
_bash_session = {
    "process": None
}

def create_bash_session():
    if _bash_session["process"] and _bash_session["process"].poll() is None:
        return False, "Bash session already active"

    try:
        process = subprocess.Popen(
            ["bash"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1
        )
        _bash_session["process"] = process
        return True, "Bash session started"
    except Exception as e:
        return False, str(e)

def exec_bash_command(command):
    process = _bash_session.get("process")
    if not process or process.poll() is not None:
        return "", "No active Bash session. Please create one first."

    try:
        # 发送命令
        process.stdin.write(command + '\n')
        process.stdin.flush()

        # 读取输出（阻塞式读，注意性能）
        output_lines = []
        while True:
            line = process.stdout.readline()
            if line.strip() == "":
                break
            output_lines.append(line)
        output = ''.join(output_lines)
        return output, ""
    except Exception as e:
        return "", f"Command execution error: {str(e)}"

def close_bash_session():
    process = _bash_session.get("process")
    if not process or process.poll() is not None:
        return False, "No active Bash session to close"

    try:
        process.terminate()
        process.wait(timeout=5)
        _bash_session["process"] = None
        return True, "Bash session closed"
    except Exception as e:
        return False, f"Error closing session: {str(e)}"
