import os
import signal
import subprocess
import sys

child_process = None
containerID = '1ec9542c3b54ba13d73096b3aaf2f6b3fc4bac2e108f34b6149a2d6b826cca7f'

def handle_exit(signum, frame):
    print(f"{signum}, exiting")
    if child_process:
        print("killing main.go")
        child_process.terminate()
    command = 'docker stop ' + containerID
    os.system(command)
    sys.exit(0)

signal.signal(signal.SIGINT, handle_exit)
signal.signal(signal.SIGTERM, handle_exit)



if __name__ == '__main__':
    command = 'docker start '+ containerID
    os.system(command)
    command = 'docker exec ' + containerID + ' service mysql start'
    os.system(command)
    child_process = subprocess.Popen(["go", "run", "main.go"])
    child_process.wait()