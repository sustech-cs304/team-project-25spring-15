from flask import Flask, request, jsonify
import shlex
import os, subprocess

app = Flask(__name__)

DIR_PATH = "/usr/Document/"
TEMPORARY_DIR = "tmp/"
TEMPORARY_NAME = "temp_script"
TEMPORARY_OUTPUT_NAME = "output"


def addExtName(name: str, code_type: str):
    if name == '':
        name = TEMPORARY_NAME
    base, ext = os.path.splitext(name)
    if not ext:
        if code_type in ['python', 'py']:
            name += '.py'
        elif code_type in ['c']:
            name += '.c'
        elif code_type in ['cpp', 'c++']:
            name += '.cpp'
        else:
            name += '.txt'
    return name

def save(code: str, file_path: str):
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(code)
    except Exception as e:
        print(str(e))
        return str(e)

def compile(compile_cmd: str):
    try:
        compile_result = subprocess.run([compile_cmd], capture_output=True, text=True, check=True, shell=True)
    except subprocess.CalledProcessError as e:
        return f"Compile error:\n{e.stderr}"
    return ""

def compose_run_cmd(run_cmd: str, args: list[int], input_path: str, output_path: str):
    if args != [] and args != None:
        safe_args = [shlex.quote(arg) for arg in args]
        run_cmd += ' ' + ' '.join(safe_args)
    elif input_path != "":
        run_cmd += f" < {shlex.quote(input_path)}"

    if output_path != "":
        run_cmd += f" > {shlex.quote(output_path)}"
    return run_cmd

def exec_file(run_cmd: str):
    try:
        run_result = subprocess.run([run_cmd], capture_output=True, text=True, check=True, shell=True)
        return run_result.stdout, ""
    except subprocess.CalledProcessError as e:
        return "", f"Runtime error:\n{e.stderr}"


@app.route('/run', methods=['POST'])
def run_code():
    # 获取请求 JSON 数据
    data = request.get_json()

    # 解析 RunnerReq 结构
    codeInfo = data.get('codeInfo')
    codeType = data.get('type')
    if codeType == "" or codeType == None:
        codeType = "txt"
    codeType = codeType.lower()
    codeDir = data.get('dir')
    codeDir = TEMPORARY_DIR + codeDir

    code = codeInfo.get('code', '')
    name = codeInfo.get('name', '')
    args = codeInfo.get('args', [])
    input_path = codeInfo.get('InputPath', "")
    output_path = codeInfo.get('outputPath', "")

    name = addExtName(name, codeType)
    file_path = DIR_PATH + codeDir + name
    # save code
    err = save(code, file_path)
    if err != None:
        print("fail to save")
        return jsonify({"error": err}), 400
    
    if codeType == 'c' or codeType == 'cpp' or codeType == 'c++':
        # compile code
        exe_path = os.path.splitext(file_path)[0]
        err = compile("gcc " + file_path + " -o " + exe_path)
        if err != "":
            print("fail to compile")
            return jsonify({"error": err}), 400
        # exec code
        run_cmd = exe_path
        run_cmd = compose_run_cmd(run_cmd, args, input_path, output_path)
        result, err = exec_file(run_cmd)
    elif codeType == 'python' or codeType == 'py':
        # exec code
        run_cmd = "python " + file_path
        run_cmd = compose_run_cmd(run_cmd, args, input_path, output_path)
        result, err = exec_file(run_cmd)
    else:
        result, err = '', 'code type not support'
    response = {
        "codeFeedback": {
            "result": result,
            "error": err,
            "filePath": ""
        }
    }

    return jsonify(response)

def run_and_check(code_type, code_path, testcases, answers, output_path):
    getScore = 0
    score_result = ""
    if code_type == 'cpp':
        exe_path = os.path.splitext(code_path)[0]
        err = compile("g++ " + code_path + " -o " + exe_path)
        if err != "":
            return getScore, score_result, str(err)
        run_cmd = exe_path
    elif code_type == 'python':
        run_cmd = "python " + code_path
    elif code_type == 'txt':
        run_cmd = ""
    else:
        return getScore, score_result, "code type not support"
    
    for index in range(len(testcases)):
        testcase = testcases[index]
        answer = answers[index]
        if run_cmd != "":
            run_cmd = compose_run_cmd(run_cmd, [], testcase.get('fileUrl'), output_path)
            exec_file(run_cmd)
        try:
            diff_result = subprocess.run(
                ["diff", "-q", output_path, answer.get('fileUrl')],
                capture_output=True,
                text=True
            )
            if diff_result.returncode == 0:
                getScore += testcase.get('score')
                score_result = score_result + str(testcase.get('score')) + ","
            else:
                score_result += "0,"
        except Exception as e:
            return getScore, score_result, f"Diff error: {str(e)}"
        
    return getScore, score_result, ""



@app.route('/check', methods=['POST'])
def run_check_answer():
    # 获取请求 JSON 数据
    data = request.get_json()

    # 解析 RunnerReq 结构
    codePath = data.get('codePath')
    codeType = data.get('type', 'txt').lower()
    testcases = data.get('testcases')
    answers = data.get('answers')
    outputPath = data.get('outputPath')

    codePath = DIR_PATH + codePath
    outputPath = DIR_PATH + codePath

    result, record, err = run_and_check(codeType, codePath, testcases, answers, outputPath)

    response = {
        "feedback": {
            "score": result,
            "record": record,
            "error": err
        }
    }

    return jsonify(response)

import uuid
from subprocess import PIPE, STDOUT

# 存放所有活跃的 bash 进程
bash_sessions: dict[str, subprocess.Popen] = {}

@app.route('/bash/create', methods=['POST'])
def create_bash():
    data = request.get_json()
    session_id = str(uuid.uuid4())
    initial_cwd = data.get('cwd', '')

    if initial_cwd != '':
        initial_cwd = DIR_PATH + initial_cwd
        if not os.path.exists(initial_cwd):
            try:
                os.makedirs(initial_cwd, exist_ok=True)
            except Exception as e:
                return jsonify({'session_id': '', 'error': f'Create dir error: {e}'}), 500

    proc = subprocess.Popen(
        ['/bin/bash'],
        stdin=PIPE, stdout=PIPE, stderr=STDOUT,
        cwd=initial_cwd,
        text=True
    )
    bash_sessions[session_id] = proc
    return jsonify({'session_id': session_id, 'cwd': initial_cwd, 'error': ''})

@app.route('/bash/exec', methods=['POST'])
def exec_bash():
    """在指定 bash 会话中执行命令，返回输出和当前工作目录"""
    data = request.get_json()
    session_id = data.get('session_id')
    cmd = data.get('command', '')
    proc = bash_sessions.get(session_id)
    if not proc:
        print("fail to exec")
        return jsonify({'output': '', 'cwd': '', 'error': 'Invalid session_id'}), 400

    # 生成两个 sentinel 用于截取命令输出和 cwd
    sentinel_out = str(uuid.uuid4())
    sentinel_cwd = str(uuid.uuid4())

    # 写入用户命令及第一个 sentinel
    proc.stdin.write(cmd + '\n')
    proc.stdin.write(f"echo {sentinel_out}\n")
    proc.stdin.flush()

    # 读取命令输出直到 sentinel_out
    output_lines = []
    while True:
        line = proc.stdout.readline()
        if not line or line.strip() == sentinel_out:
            break
        output_lines.append(line)

    # 再写入 pwd 命令及第二个 sentinel
    proc.stdin.write("pwd\n")
    proc.stdin.write(f"echo {sentinel_cwd}\n")
    proc.stdin.flush()

    # 读取 cwd 输出直到 sentinel_cwd
    cwd = ''
    while True:
        line = proc.stdout.readline()
        if not line or line.strip() == sentinel_cwd:
            break
        cwd += line.strip()

    return jsonify({
        'output': ''.join(output_lines),
        'cwd': cwd,
        'error': ''
    })

@app.route('/bash/close', methods=['POST'])
def close_bash():
    """关闭指定的 bash 会话"""
    data = request.get_json()
    session_id = data.get('session_id')
    proc = bash_sessions.pop(session_id, None)
    if not proc:
        print("fail to create")
        return jsonify({'error': 'Invalid session_id'}), 400

    proc.terminate()
    return jsonify({'error': ''})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001)
