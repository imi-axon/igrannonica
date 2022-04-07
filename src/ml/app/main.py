import os
from threading import Lock, Thread
from time import sleep, time
from typing import Dict, List
from tempfile import TemporaryFile

# FastAPI
from fastapi import FastAPI, Request, Response, WebSocketDisconnect, status, WebSocket
from fastapi.responses import PlainTextResponse, FileResponse
from models import TrainingRequest

# Models
from models import Dataset, DatasetEditActions, Statistics, TempTrainingInstance, WsConn

# Utils
from util.csv import csv_is_valid, csv_decode, csv_decode_2
from util.json import json_encode, json_decode
import util.http as httpc
from util.filemngr import FileMngr

# ML
from middleware.statistics import StatisticsMiddleware
from middleware.dataset_editor import DatasetEditor
from middleware.training import TrainingInstance


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
@app.post('/api/dataset/edit', status_code=200)
def edit_dataset(body: DatasetEditActions, response: FileResponse):
    
    print(f'EDIT: actions {body.actions}')
    print(f'EDIT: actions {body.dataset}')
    
    actions = [{'action':str.split(a['action']), 'column':(a['column'] if 'column' in a.keys() else '')} for a in json_decode(body.actions)]
    dataset = httpc.get(body.dataset)

    print(f'EDIT: dataset {dataset}')

    res = DatasetEditor.execute(actions, dataset)

    print(f'EDIT: dataset {res}')

    if res == None:
        response.status_code = status.HTTP_400_BAD_REQUEST

    print(res.replace('\n', '#').replace('\r', '@'))
    res = res.replace('\r\n', '\n')

    f = FileMngr('csv')
    f.create(res)
    f.delete()

    return FileResponse(f.path())

# Get Dataset Statistics
@app.post('/api/dataset/statistics', status_code=200, response_model=Statistics)
def get_statistics(body: Dataset):
    
    print(body)

    csvstr: str = httpc.get(body.dataset)

    print(csvstr)

    stats: str = StatisticsMiddleware(csvstr).statistics_json()

    # print(stats)

    return { 'statistics': stats }



# ==== WebSockets ====

@app.websocket("/api/nn/train/start")
async def training_stream(ws: WebSocket):
    await ws.accept()
    await ws.send_bytes(b'') # confirm
    print('Accepted')
    
    data = await ws.receive_json()

    print(data)
    print(data['conf'])
    datasetlink = data['dataset']
    nnlink = data['nn']
    conf = json_decode(data['conf'])

    buff: List[bytes] = []
    lock: Lock = Lock()

    # await ws.send_bytes('1')
    # await ws.send_bytes('2')
    # await ws.send_bytes('3')

    # await ws.close(code=1000)
    # return

    try:
        t = time()
        print('try')
        th = Thread(target=TrainingInstance(buff, lock).train, args=(datasetlink, nnlink, conf['inputs'], conf['outputs']))
        print('new th')
        th.start()
        print('th start')
        # i = 0
        while True:
            # print(buff)
            print('>>')
            # if i < 3:
            #     print('')
            #     sleep(1)
            #     i += 1
            if len(buff) > 0:
                lock.acquire(blocking=True)
                b: bytes = buff.pop(0)
                lock.release()
                print(b)
                if b == b'':
                    print(':::: empty')
                    while len(buff) == 0:
                        sleep(0.001)
                    lock.acquire(blocking=True)
                    b = buff.pop(0)
                    lock.release()
                    await ws.send_text(b)
                    await ws.close(code=1000)
                    print(b.decode('utf-8'))
                    break
                else:
                    print('>>> send bytes')
                    # await ws.send_text(b.decode('utf-8'))
                    await ws.send_text(b)

        th.join()
        print(f'time: {time()-t}')

    except WebSocketDisconnect:
        pass
