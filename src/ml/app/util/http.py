import httpx

baseURL = 'https://localhost:7057/'
baseHeaders = {'Host':'localhost:8000'}
sslVerify = False

def get(filepath: str, decode: bool = True) -> str | bytes:
    
    path = baseURL + filepath
    path = path.replace('\\', '/')
    response = httpx.get(path, verify = sslVerify, headers = baseHeaders)

    return response.read().decode() if decode else response.read()


def put(filepath: str) -> bool:

    path = baseURL + filepath
    path = path.replace('\\', '/')
    response = httpx.put(path, verify = sslVerify, headers = {'Host':'localhost:8000'})

    return response.status_code == 200 or response.status_code == 201