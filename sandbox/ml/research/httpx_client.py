import httpx

class HttpClient():

    def send(addr: str):
        resp = httpx.get(addr, verify=False)
        return { 'body': resp.content }

resp = HttpClient.send('https://localhost:7057/Storage/file.txt')
print(resp['body'].decode())