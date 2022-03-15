import csv
import json
from flask import Flask, request

app = Flask(__name__)

# Utilities

# Vraca informacije o formatu CSV stringa
def get_csv_dialect(csv_str: str) -> csv.Dialect:

    sniffer = csv.Sniffer()
    dialect = sniffer.sniff(csv_str)
    return dialect


# Konvertuje JSON string u objekat
def json_to_object(json_str: str):

    return json.JSONDecoder().decode(json_str)


# Konvertuje objekat/listu u JSON string
def object_to_json(obj):

    return json.JSONEncoder().encode(obj)


# Konvertuje CSV string u listu listi (uz detekciju formata CSV-a)
def csv_to_list(csv_str: str) -> list[list]:
    
    dialect = get_csv_dialect(csv_str)
    lines = csv_str.splitlines()
    reader = csv.reader(lines, dialect) # !!! Ima problem kad se koriste navodnici, tada iako redovi imaju razlicit broj elemenata konvertuje u niz
    result = [x for x in reader]
    print(result)
    return result


# True ako je konverzija uspesna, False u suprotnom
def csv_is_valid(csv_str):

    try:
        csv_to_list(csv_str)
        return True
    except:
        return False


# Routes

# Aktivnost: Add Data Set
@app.route('/api/dataset/validate/csv', methods=['POST'])
def validate_csv():

    csvstring = request.data.decode()

    if csv_is_valid(csvstring):
        return ('CSV je u ispravnom formatu', 201)

    return ('CSV nije u ispravnom formatu', 400)


# Aktivnost: Get Data Set
@app.route('/api/dataset/convert/json', methods=['POST'])
def convert_csv_to_json():

    csvstring = request.data.decode()
    # print(csvstring)
    resp = None

    try:
        obj = csv_to_list(csvstring)
        # print(obj)
        resp = object_to_json(obj)
        # print(resp)
    except:
        return ('CSV nije u ispravnom formatu', 400)

    return (resp, 201)
