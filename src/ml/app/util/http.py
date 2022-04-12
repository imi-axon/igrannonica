import httpx

baseURL = 'https://localhost:7057/'
baseHeaders = {'Host':'localhost:8000'}
sslVerify = False

def get(filepath: str, decode: bool = True) -> str | bytes:
    
    headers = baseHeaders.copy()

    path = baseURL + filepath
    path = path.replace('\\', '/')
    print(f'GET {path}')

    response = httpx.get(path, verify = sslVerify, headers = headers)

    return response.read().decode() if decode else response.read()


def put(filepath: str, local_filepath: str, sendHost: bool = True) -> bool:

    headers = baseHeaders.copy()
    #headers['Content-Type']
    if not sendHost:
        headers.pop('Host')

    path = baseURL + filepath
    path = path.replace('\\', '/')
    print(f'PUT {path}')

    f = open(local_filepath, 'rb')
    files = {'upload-file': f}
    response = httpx.put(path, verify = sslVerify, files = files, headers = headers)

    print('REQUEST\n Headers:')
    for i in response.request.headers.multi_items():
        print(f'    {i[0]}: {i[1]}')
    print('Body')
    print(response.request.read())

    f.close()

    return response.status_code