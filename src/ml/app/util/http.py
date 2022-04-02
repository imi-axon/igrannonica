import httpx

baseurl = 'https://localhost:7057/'

def get(filepath: str) -> str:
    response = httpx.get(baseurl + filepath, verify=False)
    
    print(f'>||||>>>>> {response.content.decode()}')
    # for (hk, hv) in response.headers.multi_items():
    #     print(f'{hk}: {hv}')
    return response.read().decode()