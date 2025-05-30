from flask import Blueprint, request, jsonify
from utils.compile_run import compile_code, compose_run_cmd, exec_file
from config import BASE_DIR
import os
import subprocess

check_bp = Blueprint('check', __name__)

@check_bp.route('/check', methods=['POST'])
def run_check_answer():
    data = request.get_json()
    code_path = data.get('codePath')
    code_type = data.get('type', 'txt').lower()
    testcases = data.get('testcases', [])
    answers = data.get('answers', [])
    output_path = os.path.join(os.path.dirname(code_path), data.get('outputPath'))
    scores = data.get('scores', [])

    result, record, err = run_and_check(code_type, code_path, testcases, answers, scores, output_path)

    return jsonify({
        "feedback": {
            "score": result,
            "record": record,
            "error": err,
            "fileType": code_type
        }
    })


def run_and_check(code_type, code_path, testcases, answers, scores, output_path):
    get_score = 0
    score_result = ""

    if code_type == 'cpp':
        exe_path = os.path.splitext(code_path)[0]
        err = compile_code(f"g++ {code_path} -o {exe_path}")
        if err:
            return get_score, score_result, err
        run_cmd = exe_path
    elif code_type in ['python', 'py']:
        run_cmd = f"python {code_path}"
    else:
        return get_score, score_result, "code type not supported"

    for i, testcase in enumerate(testcases):
        answer_path = answers[i].get('fileUrl')
        cmd = compose_run_cmd(run_cmd, [], testcase.get('fileUrl'), output_path)
        exec_file(cmd)
        diff_result = subprocess.run(["diff", "-Z", output_path, answer_path], capture_output=True, text=True)
        score = scores[i] if diff_result.returncode == 0 else 0
        get_score += score
        score_result += f"{score},"

    return get_score, score_result, ""
