import httpx

baseurl = 'https://localhost:7057/'

def get(filepath: str, binary: bool = False) -> str | bytes:
    path = baseurl + filepath
    path = path.replace('\\', '/')
    response = httpx.get(path, verify=False, headers = {'Host':'localhost:8000'})
    
    print(f'>||||>>>>> {response.read().decode()}')
    # for (hk, hv) in response.headers.multi_items():
    #     print(f'{hk}: {hv}')
    return response.read() if binary else response.read().decode()