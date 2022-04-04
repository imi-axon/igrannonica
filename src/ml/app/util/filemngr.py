import os

class FileMngr():

    fid = 0

    def __init__(self, filepath = f'./temp{fid}'):
        self.filepath = filepath
        fid += 1

    def create(self, content: bytes):
        f = open(self.filepath, 'wb')
        f.write(content)
        f.close()

    def delete(self):
        os.remove(self.filepath)

    def path(self) -> str:
        return self.filepath