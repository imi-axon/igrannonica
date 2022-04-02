import csv
import urllib3
import httpx
from time import sleep
from typing import Callable, Coroutine, List


resp = httpx.get('https://localhost:7057/Storage/csv.csv', verify=False)
print(resp.read().decode())





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
