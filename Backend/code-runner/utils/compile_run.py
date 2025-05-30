import subprocess
import shlex

def compile_code(compile_cmd: str):
    try:
        subprocess.run([compile_cmd], capture_output=True, text=True, check=True, shell=True)
    except subprocess.CalledProcessError as e:
        return f"Compile error:\n{e.stderr}"
    return ""

def compose_run_cmd(run_cmd: str, args: list[str], input_path: str, output_path: str):
    if args:
        run_cmd += ' ' + ' '.join([shlex.quote(arg) for arg in args])
    if input_path:
        run_cmd += f" < {shlex.quote(input_path)}"
    if output_path:
        run_cmd += f" > {shlex.quote(output_path)}"
    return run_cmd

def exec_file(run_cmd: str):
    try:
        result = subprocess.run([run_cmd], capture_output=True, text=True, check=True, shell=True, timeout=30)
        return result.stdout, ""
    except subprocess.TimeoutExpired:
        return "", "Timeout error: execution exceeded 30 seconds."
    except subprocess.CalledProcessError as e:
        return "", f"Runtime error:\n{e.stderr}"
