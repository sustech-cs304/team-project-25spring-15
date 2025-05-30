from flask import Blueprint, request, jsonify
from config import BASE_DIR, TEMPORARY_DIR
from utils.file_ops import add_ext_name, save
from utils.compile_run import compile_code, compose_run_cmd, exec_file

run_bp = Blueprint('run', __name__)

@run_bp.route('/run', methods=['POST'])
def run_code():
    data = request.get_json()
    code_info = data.get('codeInfo')
    code_type = data.get('type', 'txt').lower()
    code_dir = TEMPORARY_DIR + data.get('dir', '')
    code = code_info.get('code', '')
    name = add_ext_name(code_info.get('name', ''), code_type)
    file_path = BASE_DIR + code_dir + name

    err = save(code, file_path)
    if err:
        return jsonify({"error": err}), 400

    args = code_info.get('args', [])
    input_path = code_info.get('InputPath', '')
    output_path = code_info.get('outputPath', '')

    if code_type in ['c', 'cpp', 'c++']:
        exe_path = file_path.rsplit('.', 1)[0]
        err = compile_code(f"g++ {file_path} -o {exe_path}")
        if err:
            return jsonify({"error": err}), 400
        run_cmd = compose_run_cmd(exe_path, args, input_path, output_path)
        result, err = exec_file(run_cmd)
    elif code_type in ['python', 'py']:
        run_cmd = compose_run_cmd(f"python {file_path}", args, input_path, output_path)
        result, err = exec_file(run_cmd)
    else:
        return jsonify({"error": "code type not supported"}), 400

    return jsonify({
        "codeFeedback": {
            "result": result,
            "error": err,
            "filePath": ""
        }
    })
