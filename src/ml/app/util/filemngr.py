import os
from tempfile import TemporaryFile

class FileMngr():

    def __init__(self, filepath = f'temp.csv'):
        self.filepath = './' + filepath

    def create(self, content: str):
        f = open(self.filepath, 'w', encoding='UTF-8')
        f.write(content)
        f.close()
        # self.tmpfile = TemporaryFile()
        # self.tmpfile.write(content)

    def delete(self):
        os.remove(self.filepath)
        # self.tmpfile.close()


    def path(self) -> str:
        return self.filepath
        # print(f'temp file name: {self.tmpfile.name}')
        # return self.tmpfile.name