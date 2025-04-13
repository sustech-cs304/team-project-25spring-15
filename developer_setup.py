import subprocess

def imageDownload(imageName):
    command = "docker pull " + imageName
    result = subprocess.run(
        command, 
        shell=True, 
        stdout=subprocess.PIPE, 
        stderr=subprocess.PIPE,
        text=True
    )
    return result.returncode, result.stdout, result.stderr

def containerCreating(dockerName, imageName, hostPath, dockerPath):
    command = "docker run -d -it --name "+ dockerName +" -v "+ hostPath +":"+ dockerPath +" "+ imageName +""
    result = subprocess.run(
        command, 
        shell=True, 
        stdout=subprocess.PIPE, 
        stderr=subprocess.PIPE,
        text=True
    )
    return result.returncode, result.stdout, result.stderr

if __name__ == "__main__":
    dockerImages = ["mysql:8.0", "python:3.13.2", "gcc:14.2.0"]
    maxTryTime = 5

    tryTime = 0
    for image in len(dockerImages):
        result, out, err = imageDownload(dockerImages[image])
        image -= result
        tryTime += result
        if tryTime > maxTryTime:
            print(out)
            print(err)
            break
    
    for image in len(dockerImages):
        result, out, err = containerCreating(dockerImages[image])
        image -= result
        tryTime += result
        if tryTime > maxTryTime:
            print(out)
            print(err)
            break
        
