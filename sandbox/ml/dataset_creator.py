from random import random, randint
from typing import List

class DatasetCreator():

    def __init__(self, numcols, numrows, numouts=1, separator = ';'):
        self.colnames = [f'Col{i+1}' for i in range(numcols - numouts)] + [f'Out{i+1}' for i in range(numouts)]
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

    def rand_multiply_col(self, col, mul):
        print(f'multiply {col} * {mul}')
        r = lambda: randint(-100, 100) / 100 / 8
        newcol = []
        for x in col[1:]:
            print(f'x: {x}')
            newcol.append(x * mul)
        return newcol

    

    def gen_dataset(self, regenerate = True):
        if regenerate == False and self.dataset != None:
            return

        self.dataset = [[self.colnames[0]] + self.rand_col()]
        print(self.dataset)
        for i in range(1, len(self.colnames)):
            input()
            self.dataset.append([self.colnames[i]] + self.rand_multiply_col(self.dataset[-1], 1.5))
            print(self.dataset)

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