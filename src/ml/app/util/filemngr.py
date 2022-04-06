import os
from time import sleep
from threading import Thread
import random

class FileMngr():

    def __init__(self, ext: str):
        s = ''
        for _ in range(24):
            s += str(random.randint(0,9))

        self.filename = f'axontemp_{s}.{ext}'
        self.filepath = './temp/' + self.filename

        self.delete_delay = 15

    def create(self, content: str | bytes):
        if isinstance(content, str):
            f = open(self.filepath, 'w', encoding='UTF-8')
            f.write(content)
            f.close()
        elif isinstance(content, bytes):
            f = open(self.filepath, 'wb')
            f.write(content)
            f.close()

    def delete(self, delay: int | None = None):
        def to_delete_file(sleep_time, file_path):
            print('to delete file begin')
            sleep(sleep_time)
            os.remove(file_path)
            print('to delete file end')

        th = Thread(target = to_delete_file, args=(self.delete_delay if delay == None else delay, self.filepath))
        th.start()

    def name(self) -> str:
        return self.filename

    def path(self) -> str:
        return self.filepath