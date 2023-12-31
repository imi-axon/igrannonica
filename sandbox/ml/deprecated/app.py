import sys

# Putanje
sys.path.append('../')

# ML Service Adapter
import mlservice.ml_adapter as ml
from util.dataset import DatasetEditor

from const import ROOT_ROUTE
from util.csv import *
from util.json import *

from flask import Flask, request

app = Flask(__name__)

# ==== Routes ====

# Aktivnost: Add Dataset
@app.route(ROOT_ROUTE+'dataset/validate/csv', methods=['POST'])
def validate_csv():

    print('Pocetak kontrolera (za Add Dataset)')

    csvstring = request.data.decode()

    if csv_is_valid(csvstring):
        return ('CSV je u ispravnom formatu', 201)

    return ('CSV nije u ispravnom formatu', 400)


# Aktivnost: Get Dataset
@app.route(ROOT_ROUTE+'dataset/convert/json', methods=['POST'])
def convert_csv_to_json():

    print('Pocetak kontrolera (za Get Dataset)')

    csvstring = request.data.decode()
    # print(csvstring)
    resp = None

    try:
        obj = csv_decode(csvstring)
        # print(obj)
        resp = json_encode(obj)
        # print(resp)
    except:
        return ('CSV nije u ispravnom formatu', 400)

    return (resp, 201)


# Aktivnost: Edit Dataset
@app.route(ROOT_ROUTE+'dataset/edit', methods=['POST'])
def edit_dataset():

    payload = json_decode(request.data.decode())
    
    actions = [{'action':str.split(a['action']), 'column':a['column']} for a in payload['actions']]
    dataset = payload['data']
    # dataset = csv_decode(payload['data'])

    DatasetEditor.execute(actions, dataset)

    return ('Sve je u redu', 200)


