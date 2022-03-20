from csv import Dialect, Sniffer, reader as csvreader

# ==== CSV ====

# Vraca informacije o formatu CSV stringa
def get_csv_dialect(text: str) -> Dialect:

    sniffer = Sniffer()
    dialect = sniffer.sniff(text)
    return dialect


# Konvertuje CSV string u listu listi (uz detekciju formata CSV-a)
def csv_decode(text: str) -> list[list]:
    
    dialect = get_csv_dialect(text)
    lines = text.splitlines()
    reader = csvreader(lines, dialect) # !!! Ima problem kad se koriste navodnici, tada iako redovi imaju razlicit broj elemenata konvertuje u niz
    result = [x for x in reader]
    # print(result)
    return result


# True ako je konverzija uspesna, False u suprotnom
def csv_is_valid(text):

    try:
        csv_decode(text)
        return True
    except:
        return False


