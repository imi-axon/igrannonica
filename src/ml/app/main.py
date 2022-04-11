import os
from threading import Lock, Thread, current_thread
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
from middleware.model import NNModelMiddleware


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


# Get Default NN file
@app.put('/api/nn/default', status_code=200)
def get_default_nn():

    # TEMP --
    inputs = ['A']
    outputs = ['B']
    # TEMP --
    
    nnmodel = NNModelMiddleware()
    nnmodel.new_default_model(inputs, outputs)
    fm = FileMngr('h5')
    nnmodel.save_model(fm.directory(), fm.name())
    fm.delete()

    def_conf = {
        'inputs' :          inputs,
        'outputs' :         outputs,
        'neuronsPerLayer' : [3, 2],
        'actPerLayer' :     ['relu', 'relu'],
        'actOut' :          'linear',
        'learningRate' :    0.1,
        'reg' :             'L1',
        'regRate' :         0.1,
        'batchSize' :       1,
        'trainSplit' :      0.8,
        'valSplit' :        0.2
    }

    fc = FileMngr('json')
    fc.create(json_encode(def_conf))
    fc.delete()
    

# Get Default NN file
@app.get('/api/nn/new/default', status_code=200)
def get_default_nn_model():
    
    # TEMP --
    inputs = ['A']
    outputs = ['B']
    # TEMP --
    
    nnmodel = NNModelMiddleware()
    nnmodel.new_default_model(inputs, outputs)
    fm = FileMngr('h5')
    nnmodel.save_model(fm.directory(), fm.name())
    fm.delete()

    return FileResponse(fm.path())

# Get Default NN Config
@app.get('/api/nn/conf/default', status_code=200)
def get_default_nn_conf():
    
    # TEMP --
    inputs = ['A']
    outputs = ['B']
    # TEMP --

    def_conf = {
        'inputs' :          [],
        'outputs' :         [],
        'neuronsPerLayer' : [3, 2],
        'actPerLayer' :     ['relu', 'relu'],
        'actOut' :          'linear',
        'learningRate' :    0.1,
        'reg' :             'L1',
        'regRate' :         0.1,
        'batchSize' :       1,
        'trainSplit' :      0.8,
        'valSplit' :        0.2
    }

    f = FileMngr('json')
    f.create(json_encode(def_conf))
    f.delete()

    return FileResponse(f.path())


# ==== WebSockets ====

@app.websocket("/api/nn/train/start")
async def training_stream(ws: WebSocket):
    start_time = time()

    await ws.accept()
    await ws.send_bytes(b'') # confirm
    print('Accepted')
    
    data = await ws.receive_json()

    # print(data)
    print(data['conf'])
    datasetlink = data['dataset']
    nnlink = data['nn']
    conf = json_decode(data['conf'])

    # TEMP
    conf['actPerLayer'] = ['relu' for _ in range(3)]
    conf['neuronsPerLayer'] = [3 for _ in range(3)]

    buff: List[bytes] = []
    lock: Lock = Lock()

    try:
        th = Thread(target=TrainingInstance(buff, lock).train, args=(datasetlink, nnlink, conf))
        th.start()

        finished = False

        # i = 0
        while not finished:
            
            lock.acquire(blocking=True) # [ X ]
            if len(buff) > 0:
                b = buff.pop(0)
                lock.release() # [   ]
                print(b)
                
                if b == b'': 
                    await ws.send_text(b) # >>>>
                    while True:
                        lock.acquire(blocking=True) # [ X ]
                        if len(buff) > 0:
                            break
                        lock.release() # [   ]

                    b = buff.pop(0)
                    lock.release() # [   ]

                    await ws.send_text(b) # >>>>
                    finished = True
                    
                else:
                    print('>>> send bytes')
                    await ws.send_text(b) # >>>>

            else:
                lock.release() # [   ]

        print(f'time: { time() - start_time }')
        await ws.close(code = 1000)

    except WebSocketDisconnect:
        pass
