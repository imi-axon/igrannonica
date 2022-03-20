import json
import csv

# ==== JSON ====

# Konvertuje JSON string u objekat
def json_decode(json_str: str):

    return json.JSONDecoder().decode(json_str)


# Konvertuje objekat/listu u JSON string
def json_encode(obj):

    return json.JSONEncoder().encode(obj)


# ==== CSV ====

# Vraca informacije o formatu CSV stringa
def get_csv_dialect(csv_str: str) -> csv.Dialect:

    sniffer = csv.Sniffer()
    dialect = sniffer.sniff(csv_str)
    return dialect


# Konvertuje CSV string u listu listi (uz detekciju formata CSV-a)
def csv_decode(csv_str: str) -> list[list]:
    
    dialect = get_csv_dialect(csv_str)
    lines = csv_str.splitlines()
    reader = csv.reader(lines, dialect) # !!! Ima problem kad se koriste navodnici, tada iako redovi imaju razlicit broj elemenata konvertuje u niz
    result = [x for x in reader]
    # print(result)
    return result


# True ako je konverzija uspesna, False u suprotnom
def csv_is_valid(csv_str):

    try:
        csv_decode(csv_str)
        return True
    except:
        return False


