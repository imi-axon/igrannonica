import csv
import urllib3
import httpx
from time import sleep
from typing import Callable, Coroutine, List
from os import SEEK_SET
from tempfile import TemporaryFile
import time

def f():
    # zahtev za fajl
    t1 = time.time()
    resp = httpx.get('https://localhost:7057/Storage/csv2.csv', verify = False, headers = {'Host':'localhost:8000'})
    t1 = time.time() - t1

    # postojeci fajl
    t2 = time.time()
    new_file = open('./csv2.csv', 'wb')
    new_file.write(resp.read())

    new_file.close()
    t2 = time.time() - t2

    print(f'request: {t1}s, write: {t2}s')

f()

# # privremeni prazan
# temp_file = TemporaryFile()

# # postojeci fajl
# print('---')
# new_file = open('./csv2.csv')
# b = bytes(new_file.read(),'UTF-8')
# #print(b)

# temp_file.write(b)
# temp_file.seek(SEEK_SET)

# new_file.close()

# #print(temp_file.read().decode())
# print('---')





# class Klasa():

#     def __init__(self) -> None:
#         self.var = 'Moja promenljiva'

#     def fun(self, f: float):
#         print(f'{self.var} : {f}')


# def funkcija(cb: Callable):
#     cb(4.5)

# #funkcija(Klasa().fun)

# a = [1,2,3]

# async def asink1(a: List):
#     print('asink: pocetak...')
#     sleep(3)
#     print('asink: kraj.')
#     a.pop()
#     return 1

# def norm():
#     print('norm: pocetak...')
#     nesto = asink1(a)
#     print('norm: kraj.')
#     return nesto

# async def asink2(prom: Coroutine):
#     print('asink: pocetak...')
#     await asink1(a)
#     print('asink: kraj.')
#     return 2


# x = norm()
# print(x)
# asink2(x)

# sleep(5)

# print(a)
