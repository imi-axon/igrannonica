import os
from random import randint, random
from threading import Lock, Thread, current_thread
from time import sleep, time
from typing import Dict, List
from tempfile import TemporaryFile

# Cofigs
import config as cfg

# FastAPI
from fastapi import FastAPI, Request, Response, WebSocketDisconnect, status, WebSocket
from fastapi.responses import PlainTextResponse, FileResponse

# Models
from models import Dataset, DatasetEditActions, Statistics, TempTrainingInstance, NNOnly, NNCreate

# Utils
from util.csv import csv_is_valid, csv_decode, csv_decode_2
from util.json import json_encode, json_decode
import util.http as httpc
from util.filemngr import FileMngr
from util.ttm import TTM, TrainingThread

# ML
from middleware.statistics import StatisticsMiddleware
from middleware.dataset_editor import DatasetEditor
from middleware.training import TrainingInstance
from middleware.model import NNModelMiddleware
from middleware.NN import NN_Middleware as NNJsonConverter


app = FastAPI()


# ==== Routes ====

# Add Dataset
@app.post('/api/dataset/validate/csv', status_code=201)
def validate_csv(body: Dataset, response: Response):

    # print('Pocetak kontrolera (za Add Dataset)')
    # print(f'{body.dataset}')
    csvstring = httpc.get(body.dataset)

    # print(f'>>>>>>>>>> {csvstring}')

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
    
    # print(f'EDIT: actions {body.actions}')
    # print(f'EDIT: actions {body.dataset}')
    
    actions = [{'action':str.split(a['action']), 'column':(a['column'] if 'column' in a.keys() else '')} for a in json_decode(body.actions)]
    dataset = httpc.get(body.dataset)

    # print(f'EDIT: dataset {dataset}')

    res = DatasetEditor.execute(actions, dataset)

    # print(f'EDIT: dataset {res}')

    if res == None:
        response.status_code = status.HTTP_400_BAD_REQUEST

    # print(res.replace('\n', '#').replace('\r', '@'))
    res = res.replace('\r\n', '\n')

    f = FileMngr('csv')
    f.create(res)
    f.delete()

    return FileResponse(f.path())

# Get Dataset Statistics
@app.post('/api/dataset/statistics', status_code=200, response_model=Statistics)
def get_statistics(body: Dataset):
    
    # print(body)

    csvstr: str = httpc.get(body.dataset)

    # print(csvstr)

    stats: str = StatisticsMiddleware(csvstr).statistics_json()

    # print(stats)

    return { 'statistics': stats }


# Convert NN to JSON
@app.post('/api/nn/convert/json', status_code=200, response_model=NNOnly)
def nn_to_json(body: NNOnly):

    # print(f'GET NN: body.nn: {body.nn}')

    h5bytes: bytes = httpc.get(body.nn, decode=False)
    h5mngr = FileMngr('h5')
    h5mngr.create(h5bytes)
    h5path = h5mngr.path()

    # print(f'GET NN: h5 path: {h5path}')

    conv = NNJsonConverter(h5path)
    h5mngr.delete()
    s = conv.NN_json()

    return {'nn': s}

# Update NN and CONF
@app.put('/api/nn/default', status_code=200)
def update_with_default_nn(body: NNCreate, response: Response):

    # print(body)

    headers = csv_decode(body.headers)[0]
    # print(headers)
    if len(headers) < 2:
        response.status_code = 400
        return

    # MOZE DRUGACIJE !!! 
    # = 2 kolone =>  in: [c0]      out: [c1]
    # > 2 kolone =>  in: [c0, c1]  out: [c2]
    inputs = [headers[0]] + ([headers[1]] if len(headers) > 2 else [])
    outputs = [headers[2 if len(headers) > 2 else 1]]
    
    nnmodel = NNModelMiddleware()
    nnmodel.new_default_model(inputs, outputs)
    fm = FileMngr('h5')
    nnmodel.save_model(fm.directory(), fm.name())
    r = httpc.put(body.nn, fm.path())
    # print(f'PUT NN: {r}')
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
    # print(f'PUT CONF: {httpc.put(body.conf, fc.path())}')
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
    data = await ws.receive_json()
    await ws.send_bytes(b'') # confirm
    print('Accepted')
    

    # print(data)
    print(data)
    datasetlink = data['dataset']
    nnlink = data['nn']
    conflink = data['conf']
    conf = json_decode(data['newconf'])

    # TEMP
    # conf['actPerLayer'] = ['relu' for _ in range(3)]
    # conf['neuronsPerLayer'] = [3 for _ in range(3)]

    tt: TrainingThread = None

    buff: List[bytes] = []
    flags = {'stop': False}
    lock: Lock = Lock()

    try:
        th = Thread(target=TrainingInstance(buff, lock, flags).train, args=(datasetlink, nnlink, conf))

        tt = TrainingThread(th, buff, flags, lock)
        buff = tt.buffer
        flags = tt.flags
        lock = tt.lock

        if not TTM.add(tt, randint(1,100), randint(1,100)):
            raise Exception()

        TTM.pretty_print()

        th.start()

        print('Thread Started')

        finished = False
        await_play = False

        while not finished:
            print('---- Main Loop ----')
            
            # print(f'finished: {finished}')
            # print(f'flag stop: {flags["stop"]}')
            # print(f'locked: {lock}')

            rcv = 'play'

            if await_play:
                print('--==> AWAIT BACK PLAY')
                rcv = await ws.receive_text()
                await_play = False
                print('--==> RECIEVED: ' + rcv)
            
            if rcv == 'stop':
                print(f'> RCV = stop')
                flags['stop'] = True
                finished = True
            
            lock.acquire(blocking=True) # [ X ]
            

            print('--==> Buffer')
            print(buff)

            # print(len(buff))
            if len(buff) > 0:
                await_play = True
                b = buff.pop(0)
                print(f'> BUFFER POP -> {b.decode()}')
                TTM.pretty_print()
                lock.release() # [   ]
                # print(b)
                
                if b == b'end': 
                    print(f'> END BLOCK')
                    await ws.send_text(b.decode()) # >>>>
                    print(f'> Poslat Backu END Message')
                    while True:
                        lock.acquire(blocking=True) # [ X ]
                        if len(buff) > 0:
                            break
                        lock.release() # [   ]

                    b = buff.pop(0)
                    lock.release() # [   ]

                    # await ws.send_text(b.decode()) # >>>>
                    finished = True
                    
                else:
                    print('>>> send bytes')
                    await ws.send_text(b.decode()) # >>>>

            else:
                lock.release() # [   ]

        print(f'time: { time() - start_time }')
        await ws.close(code = 1000)

    except WebSocketDisconnect:
        print('-=| WS Disconnect |=-')
    # except Exception:
        
    #     print('-=| EXCEPTION |=-')

    TTM.pretty_print()

    print('-'*16)



# BACKUP
@app.websocket("/api/nn/train/start1")
async def training_stream_1(ws: WebSocket):
    start_time = time()

    await ws.accept()
    data = await ws.receive_json()
    await ws.send_bytes(b'') # confirm
    print('Accepted')
    

    # print(data)
    print(data)
    datasetlink = data['dataset']
    nnlink = data['nn']
    conflink = data['conf']
    conf = json_decode(data['newconf'])

    # TEMP
    # conf['actPerLayer'] = ['relu' for _ in range(3)]
    # conf['neuronsPerLayer'] = [3 for _ in range(3)]

    buff: List[bytes] = []
    lock: Lock = Lock()
    flags = {'stop': False}

    try:
        th = Thread(target=TrainingInstance(buff, lock, flags).train, args=(datasetlink, nnlink, conf))
        th.start()

        finished = False
        await_play = True

        while not finished:
            
            # print(f'finished: {finished}')
            # print(f'flag stop: {flags["stop"]}')
            # print(f'locked: {lock}')

            rcv = 'play'

            if await_play:
                print('> AWAIT BACK PLAY')
                rcv = await ws.receive_text()
                await_play = False
                print('> RECIEVED: ' + rcv)
            
            if rcv == 'stop':
                print(f'> RCV = stop')
                flags['stop'] = True
                finished = True
            
            lock.acquire(blocking=True) # [ X ]
            

            # print(len(buff))
            if len(buff) > 0:
                await_play = True
                b = buff.pop(0)
                print(f'> BUFFER POP -> {b.decode()}')
                lock.release() # [   ]
                # print(b)
                
                if b == b'end': 
                    print(f'> END BLOCK')
                    await ws.send_text(b.decode()) # >>>>
                    print(f'> Poslat Backu END Message')
                    while True:
                        lock.acquire(blocking=True) # [ X ]
                        if len(buff) > 0:
                            break
                        lock.release() # [   ]

                    b = buff.pop(0)
                    lock.release() # [   ]

                    # await ws.send_text(b.decode()) # >>>>
                    finished = True
                    
                else:
                    print('>>> send bytes')
                    await ws.send_text(b.decode()) # >>>>

            else:
                lock.release() # [   ]

        print(f'time: { time() - start_time }')
        await ws.close(code = 1000)

    except WebSocketDisconnect:
        pass

    print('KKKKRRRRAAAAAJJJJJJJ')
