import httpx

baseURL = 'https://localhost:7057/api/files/'
baseHeaders = {'Host':'localhost:8000'}
sslVerify = False


def debug_request(response):
    print('== REQUEST ==')
    print('-- Headers --')
    for i in response.request.headers.multi_items():
        print(f'    {i[0]}: {i[1]}')
    print('-- Body --')
    print('== RESPONSE ==')
    print(f'Status code: {response.status_code}')
    print(response.request.read())


def get(filepath: str, decode: bool = True) -> str | bytes:
    
    headers = baseHeaders.copy()

    path = baseURL + filepath
    path = path.replace('\\', '/')
    print(f'GET {path}')

    response = httpx.get(path, verify = sslVerify, headers = headers)
    
    debug_request(response)

    return response.read().decode() if decode else response.read()


def put(filepath: str, local_filepath: str) -> bool:

    headers = baseHeaders.copy()

    path = baseURL + filepath
    path = path.replace('\\', '/')
    print(f'PUT {path}')

    f = open(local_filepath, 'rb')
    response = httpx.put(path, files = {'file': f}, verify = sslVerify, headers = headers)
    
    debug_request(response)

    f.close()
    return response.status_code
