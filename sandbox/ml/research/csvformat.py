from typing import Tuple
from numpy import NaN
import pandas
from csv import Sniffer, Dialect, reader as csvreader

# Vraca informacije o formatu CSV stringa
def get_csv_dialect(text: str) -> Dialect:

    sniffer = Sniffer()
    dialect = sniffer.sniff(text)
    return dialect


# Konvertuje CSV string u listu listi (uz detekciju formata CSV-a)
def csv_decode(text: str) -> Tuple[list[list], Dialect]:
    
    dialect = get_csv_dialect(text)
    lines = text.splitlines()
    reader = csvreader(lines, dialect) # !!! Ima problem kad se koriste navodnici, tada iako redovi imaju razlicit broj elemenata konvertuje u niz
    result = [x for x in reader]
    
    head = result[0]
    result = result[1:]

    result = [[(NaN if x == '' else x) for x in r] for r in result]

    # Transponse and convert to Dictionary
    # R = len(result)
    # C = len(head)
    # res = [[result[r][c] for r in range(R)] for c in range(C)]
    # result = {}
    # for i in range(C):
    #     result[head[i]] = res[i]

    # print(result)
    return result, head, dialect

csv_path : str = r'C:\Users\Dragor\Desktop\dataset.csv'
print(csv_path)

f = open(csv_path, 'r')
csv_text = f.read()

csv_list, csv_headers, csv_dialect = csv_decode(csv_text)

print(csv_list)
# print()
# print(csv_dialect.delimiter)
# print(csv_dialect.escapechar)
# print(csv_dialect.quoting)
# print(csv_dialect.doublequote)
# print(csv_dialect.quotechar)
# print(csv_dialect.lineterminator)


print('\n -- Pandas | Create dataframe from csv file -- ')
dataframe = pandas.read_csv(csv_path, sep=csv_dialect.delimiter)
print(dataframe)

print('\n -- Pandas | Create dataframe from list -- ')
dataframe = pandas.DataFrame(csv_list, columns=csv_headers)
#dataframe = dataframe.transpose()
print(dataframe)

print('\n -- Pandas | DataFrame to List -- ')
new_list = dataframe.to_dict(orient='list')
new_records = dataframe.to_dict(orient='record')

for ori in ['dict', 'list', 'series', 'split', 'records', 'index']:
    print(dataframe.to_dict(orient=ori))
#new_list = [new_list[i] for i in new_list]
# 'dict', list, 'series', 'split', 'records', 'index'

print(f'old: {csv_list}')
print(f'new: {new_list}')

# ok = [[new_list[i][j]==csv_list[i][j] for j in range(len(new_list[i]))] for i in range(len(new_list))]
# print(ok)