from flask import Flask, request, jsonify
import shlex
import os, subprocess

app = Flask(__name__)

FILE_PATH = "/home/admin/team-project-25spring-15/Backend/data/"

def compose_run_cmd(run_cmd: str, args: list[int], input_path: str, output_path: str):
    if args != []:
        safe_args = [shlex.quote(arg) for arg in args]
        run_cmd += ' ' + ' '.join(safe_args)
    elif input_path != "":
        run_cmd += f" < {shlex.quote(input_path)}"

    if output_path != "":
        run_cmd += f" > {shlex.quote(output_path)}"
    return run_cmd


def run_C_code(code: str, name: str, args: list[int], input_path: str, output_path: str, dir: str):
    file_path = FILE_PATH + dir + name

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(code)
    
    exe_path = FILE_PATH + os.path.splitext(name)[0]
    
    compile_cmd = ["gcc", file_path, "-o", exe_path]

    try:
        compile_result = subprocess.run(compile_cmd, capture_output=True, text=True, check=True)
    except subprocess.CalledProcessError as e:
        return "", f"Compile error:\n{e.stderr}"

    run_cmd = compose_run_cmd(exe_path, args, input_path, output_path)
    
    try:
        run_result = subprocess.run([run_cmd], capture_output=True, text=True, check=True)
        return run_result.stdout, ""
    except subprocess.CalledProcessError as e:
        return "", f"Runtime error:\n{e.stderr}"

def run_Python_code(code: str, name: str, args: list[int], input_path: str, output_path: str, dir: str):
    file_path = FILE_PATH + dir + name

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(code)

    run_cmd = "python " + file_path

    run_cmd = compose_run_cmd(run_cmd, args, input_path, output_path)
    
    try:
        run_result = subprocess.run([run_cmd], capture_output=True, text=True, check=True)
        return run_result.stdout, ""
    except subprocess.CalledProcessError as e:
        return "", f"Runtime error:\n{e.stderr}"

@app.route('/run', methods=['POST'])
def run_code():
    # 获取请求 JSON 数据
    data = request.get_json()

    # 解析 RunnerReq 结构
    codeInfo = data.get('codeInfo')
    codeType = data.get('type', 'string').lower()
    codeDir = data.get('dir')

    code = codeInfo.get('code', '')
    name = codeInfo.get('name', 'temp_script')
    args = codeInfo.get('args', [])
    input_path = codeInfo.get('InputPath', "")
    output_path = codeInfo.get('outputPath', "")

    if codeType == 'c' or codeType == 'cpp' or codeType == 'c++':
        result, err = run_C_code(code, name, args, input_path, output_path, codeDir)
    elif codeType == 'python' or codeType == 'py':
        result, err = run_Python_code(code, name, args, input_path, output_path, codeDir)
    else:
        result, err = '', 'code type not support'
    response = {
        "result": result,
        "error": err,
        "filePath": ""
    }

    return jsonify(response)

def run_and_check(run_method):
    for 

@app.route('/check', methods=['POST'])
def run_check_answer():
    # 获取请求 JSON 数据
    data = request.get_json()

    # 解析 RunnerReq 结构
    codeInfo = data.get('codeInfo')
    codeType = data.get('type', 'string').lower()
    testcases = data.get('testcases')
    answers = data.get('answers')
    codeDir = data.get('dir')

    code = codeInfo.get('code', '')
    name = codeInfo.get('name', 'temp_script')

    if codeType == 'c' or codeType == 'cpp' or codeType == 'c++':
        result, err = run_C_code(code, name, args, input_path, output_path, codeDir)
    elif codeType == 'python' or codeType == 'py':
        result, err = run_Python_code(code, name, args, input_path, output_path, codeDir)
    else:
        result, err = '', 'code type not support'
    response = {
        "result": result,
        "error": err,
        "filePath": ""
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001)
