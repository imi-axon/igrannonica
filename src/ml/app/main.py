# FastAPI
from fastapi import FastAPI, Response, status
from pydantic import BaseModel

# Models
from models import Dataset, DatasetEditActions

# Utils
from util.csv import csv_is_valid, csv_decode
from util.json import json_encode, json_decode
from util.dataset import DatasetEditor

# ML
# ...


app = FastAPI()

# ==== Routes ====

# Add Dataset
@app.post('/api/dataset/validate/csv', status_code=201)
def validate_csv(body: Dataset, response: Response):

    print('Pocetak kontrolera (za Add Dataset)')

    csvstring = body.dataset

    if not csv_is_valid(csvstring):
        response.status_code = status.HTTP_400_BAD_REQUEST
    
    return None


# Get Dataset
@app.post('/api/dataset/convert/json', status_code=201, response_model=Dataset)
def convert_csv_to_json(body: Dataset, response: Response):

    print('Pocetak kontrolera (za Get Dataset)')

    csvstring = body.dataset
    
    print(csvstring)
    resp = ''

    try:
        obj = csv_decode(csvstring)
        print(obj)
        resp = json_encode(obj)
        print(resp)
    except:
        response.status_code = status.HTTP_400_BAD_REQUEST
    
    fin = {'dataset': resp}

    print(fin)

    return fin


# Aktivnost: Edit Dataset
@app.post('/api/dataset/edit', status_code=200)
def edit_dataset(body: DatasetEditActions):
    
    actions = [{'action':str.split(a['action']), 'column':a['column']} for a in json_decode(body.actions)]
    dataset = body.data
    # dataset = csv_decode(payload['data'])

    DatasetEditor.execute(actions, dataset)

    return None