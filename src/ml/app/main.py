from os import SEEK_SET
from time import sleep
from typing import Dict, List
from tempfile import TemporaryFile

# FastAPI
from fastapi import FastAPI, Response, WebSocketDisconnect, status, WebSocket
from fastapi.responses import PlainTextResponse

# Models
from models import Dataset, DatasetEditActions, Statistics, TempTrainingInstance, WsConn

# Utils
from util.csv import csv_is_valid, csv_decode, csv_decode_2
from util.json import json_encode, json_decode
import util.http as httpc

# ML
from middleware.statistics import StatisticsMiddleware
from middleware.dataset_editor import DatasetEditor


app = FastAPI()

# ==== Routes ====

# Add Dataset
@app.post('/api/dataset/validate/csv', status_code=201)
def validate_csv(body: Dataset, response: Response):

    # print('Pocetak kontrolera (za Add Dataset)')
    csvstring = httpc.get(body.dataset)

    print(f'>>>>>>>>>> {csvstring}')

    if not csv_is_valid(csvstring):
        response.status_code = status.HTTP_400_BAD_REQUEST
    
    return None


# Get Dataset
@app.post('/api/dataset/convert/json', status_code=201, response_model=Dataset)
def convert_csv_to_json(body: Dataset, response: Response):

    # print('Pocetak kontrolera (za Get Dataset)')

    csvstring = httpc.get(body.dataset)
    # print(csvstring)
    
    resp = ''

    try:
        obj = csv_decode_2(csvstring)
        # print(obj)
        resp = json_encode(obj)
        # print(resp)
    except:
        response.status_code = status.HTTP_400_BAD_REQUEST
    
    fin = {'dataset': resp}

    # print(fin)

    return fin


# Edit Dataset
@app.post('/api/dataset/edit', status_code=200, response_class=PlainTextResponse)
def edit_dataset(body: DatasetEditActions, response: Response):
    
    actions = [{'action':str.split(a['action']), 'column':(a['column'] if 'column' in a.keys() else '')} for a in json_decode(body.actions)]
    dataset = httpc.get(body.dataset)

    res = DatasetEditor.execute(actions, dataset)

    if res == None:
        response.status_code = status.HTTP_400_BAD_REQUEST

    return res


# Get Dataset Statistics
@app.post('/api/dataset/statistics', status_code=200, response_model=Statistics)
def get_statistics(body: Dataset):
    
    print(body)

    csvstr: str = httpc.get(body.dataset)

    print(csvstr)

    stats: str = StatisticsMiddleware(csvstr).statistics_json()

    # print(stats)

    return { 'statistics': stats }


# 


# ==== WebSockets ====

class TrainManager:
    def __init__(self):
        self.conns: Dict[str, WsConn] = {}  # "client_id": { ws: websocket, tr: neki_objekat_vezan_za_treniranje }

    async def connect(self, client_id: str, websocket: WebSocket):
        await websocket.accept()
        self.conns[client_id] = WsConn(websocket, TempTrainingInstance())

    def disconnect(self, client_id: str):
        self.conns.pop(client_id)

    async def send(self, client_id: str) -> bool: # -> Is End
        message = await self.conns[client_id].tr.get_data()
        print(f'>>> {message}')
        
        if message == None:
            return True
        else:
            await self.conns[client_id].ws.send_text(message)
            return False

    async def receive(self, client_id: str) -> str:
        return self.conns[client_id].ws.receive_text()


manager = TrainManager()

@app.websocket("/api/nn/train/start/{client_id}")
async def training_stream(client_id: str, websocket: WebSocket):
    await manager.connect(client_id, websocket)
    #rcv = await manager.receive(client_id)

    try:
        while (await manager.send(client_id)) == False:
            sleep(1)

    except WebSocketDisconnect:
        manager.disconnect(client_id)

    finally:
        manager.disconnect(client_id)