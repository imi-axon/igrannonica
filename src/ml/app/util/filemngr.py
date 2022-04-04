import os

class FileMngr():

    def __init__(self, filepath = f'./temp'):
        self.filepath = './' + filepath

    def create(self, content: bytes):
        f = open(self.filepath, 'xb')
        f.write(content)
        f.close()

    def delete(self):
        os.remove(self.filepath)

    def path(self) -> str:
        return self.filepath