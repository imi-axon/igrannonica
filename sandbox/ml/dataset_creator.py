from random import random
from typing import List

class DatasetCreator():

    def __init__(self, colnames, numrows, separator = ';'):
        self.colnames = colnames
        self.numrows = numrows
        self.sep = separator
        self.dataset = None


    # -- Stringify --

    def join(self, arr: List) -> str:

        s = ''
        for a in arr[:-1]:
            s += str(a) + self.sep
        s += str(arr[-1])
        return s


    def join_cols(self) -> str:

        if self.dataset == None or self.dataset == []:
            return ''

        s = ''
        arr = [self.join([c[i] for c in self.dataset]) for i in range(len(self.dataset[0]))]
        for a in arr[:-1]:
            s += str(a) + '\n'
        s += str(arr[-1])
        return s


    # -- Generate --

    def rand_col(self) -> List:
        return [random() for _ in range(self.numrows)]
    

    def gen_dataset(self, regenerate = True):
        if regenerate == False and self.dataset != None:
            return
        self.dataset = [[colname] + self.rand_col() for colname in self.colnames]

    # -- Create --

    def create(self) -> str:
        self.gen_dataset(False)
        return self.join_cols()

    def create_file(self, path = './', name = 'dataset', ext = 'csv'):
        fullpath = path + name + '.' + ext
        s = self.create()
        f = open(fullpath, 'w')
        f.write(s)
        f.close()
        return fullpath



# dc = DatasetCreator(['A', 'B', 'C'], 10)
# path = dc.create_file()
# print(path)