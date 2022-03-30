import httpx

class HttpClient():

    def send(addr: str, jwt: str):
        hd = { 'Authorization': 'bearer ' + jwt}
        resp = httpx.get(addr, verify=False, headers=hd)
        return { 'body': resp.content }

jwt = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImdvbnphbGVzIiwiZW1haWwiOiJiQGcuY29tIiwiaW1lcHJlemltZSI6IkJyemkgR29uemFsZXMiLCJpZCI6IjEiLCJleHAiOjE2NDg2NzUxNTV9.brn564Sl0N1QDuBcOZpfcXi_8SKlRbiDG0cQb8yn3ApQVDZblb_hsHGSBuPGGJDV3C7o3Xg1yIbX2uZYZlm41g'
addr = 'https://localhost:7057/Storage/file.txt'
resp = HttpClient.send(addr, jwt)
print(resp['body'].decode())