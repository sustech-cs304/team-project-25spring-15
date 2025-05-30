import os
from config import TEMPORARY_NAME

def add_ext_name(name: str, code_type: str):
    if name == '':
        name = TEMPORARY_NAME
    base, ext = os.path.splitext(name)
    if not ext:
        name += {
            'python': '.py',
            'py': '.py',
            'c': '.c',
            'cpp': '.cpp',
            'c++': '.cpp'
        }.get(code_type, '.txt')
    return name

def save(code: str, file_path: str):
    try:
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(code)
    except Exception as e:
        return str(e)
