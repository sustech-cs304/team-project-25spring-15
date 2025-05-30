from flask import Blueprint, request, jsonify
from utils.bash_session import create_bash_session, exec_bash_command, close_bash_session

bash_bp = Blueprint('bash', __name__)

@bash_bp.route('/bash/create', methods=['POST'])
def bash_create():
    success, message = create_bash_session()
    if not success:
        return jsonify({"error": message}), 500
    return jsonify({"message": message}), 200

@bash_bp.route('/bash/exec', methods=['POST'])
def bash_exec():
    command = request.get_json().get('command', '')
    if not command:
        return jsonify({"error": "No command provided"}), 400
    output, error = exec_bash_command(command)
    return jsonify({"output": output, "error": error})

@bash_bp.route('/bash/close', methods=['POST'])
def bash_close():
    success, message = close_bash_session()
    if not success:
        return jsonify({"error": message}), 500
    return jsonify({"message": message}), 200
