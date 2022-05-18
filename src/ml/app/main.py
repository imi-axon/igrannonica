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
from services.util import read_str_to_df

# Models
from models import Dataset, DatasetEditActions, Statistics, NNOnly, NNCreate, MetaGenRequest, TrainingRequest

# Utils
from util.csv import csv_is_valid, csv_decode, csv_decode_2, get_csv_dialect
from util.json import json_encode, json_decode
import util.http as httpc
from util.filemngr import FileMngr

# ML
from middleware.statistics import StatisticsMiddleware
from middleware.dataset_editor import DatasetEditor
from middleware.training import TrainingInstance
from middleware.model import NNModelMiddleware
from middleware.NN import NN_Middleware as NNJsonConverter
from services.metadata import MetadataService

# Training Thread Manager
from util.ttm import TTM, TrainingThread


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
    metadata = json_decode(httpc.get(body.metapath))
    
    dialect = get_csv_dialect(dataset)

    res, df = DatasetEditor.execute(actions, dataset, dialect.delimiter, dialect.quotechar, metadata)   # metadata ce biti promenjen
    
    # Racuna se statistika, smesta u metadata i azurira se trainReady
    _ , stats = StatisticsMiddleware(df).get_stat() # _ zanemaruje se json string reprezentacija stats recnika
    metadata['statistics'] = stats
    metadata = MetadataService().updateTrainReady(metadata, stats)
    
    fm_meta = FileMngr('json')
    fm_meta.create(json_encode(metadata))
    httpc.put(body.metapath, fm_meta.path())
    fm_meta.delete(0)

    # print(f'EDIT: dataset {dataset}')
    # print(f'EDIT: dataset {res}')

    if res == None:
        response.status_code = status.HTTP_400_BAD_REQUEST

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

    dialect = get_csv_dialect(csvstr)
    df = read_str_to_df(csvstr, dialect.delimiter, dialect.quotechar)
    stats, _ = StatisticsMiddleware(df).get_stat()

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
    fm.delete(0)

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
        'trainSplit' :      0.7,
        'valSplit' :        0.1
    }

    fc = FileMngr('json')
    fc.create(json_encode(def_conf))
    httpc.put(body.conf, fc.path())
    fc.delete(0)


@app.put('/api/nn/meta/generate')
def generate_metadata(body: MetaGenRequest):

    dataset = httpc.get(body.dataset)
    dialect = get_csv_dialect(dataset)
    df = read_str_to_df(dataset, dialect.delimiter, dialect.quotechar)

    metadata = MetadataService().generate(df)
    _ , stats = StatisticsMiddleware(df).get_stat()
    metadata['statistics'] = stats

    fm_meta = FileMngr('json')
    fm_meta.create(json_encode(metadata))

    httpc.put(body.metaedit, fm_meta.path())
    httpc.put(body.metamain, fm_meta.path())

    fm_meta.delete(0)


# ==== Training ====

# Training START
@app.post('/api/user{uid}/nn{nnid}/pasive')     # << Kasnije treba promeniti u "/start"
def nn_train_start(uid: int, nnid: int, body: TrainingRequest):
    pass
    # datasetlink = body.dataset
    # nnlink = body.nn
    # conflink = body.conf
    # trainrezlink = body.trainrez
    # newconf = json_decode(body.newconf)

    # th: Thread = None
    # training_exists = TTM.nn_exist(uid, nnid)

    # if not training_exists:
    #     th = Thread(target=TrainingInstance(buff, lock, flags).train, args=(datasetlink, nnlink, conflink, trainrezlink, newconf), daemon=True)
    #     tt = TrainingThread(th, buff, flags, lock)
    #     TTM.add(tt, uid, nnid)
    #     th.start()
    #     print('> Thread started')


# Training STOP
@app.get('/api/user{uid}/nn{nnid}/stop')
def nn_train_stop(uid: int, nnid: int):
    
    if TTM.nn_exist(uid, nnid):
        tt = TTM.get_tt(uid, nnid)
        tt.lock.acquire(blocking=True)
        tt.flags['stop'] = True
        tt.lock.release()


# Training WATCH
@app.websocket("/api/user{uid}/nn{nnid}/train")
async def nn_train_watch(ws: WebSocket, uid: int, nnid: int):

    start_time = time()
    await ws.accept() # ws <ACCEPT>

    data = await ws.receive_json() # ws <<<<
    
    # confirm
    await ws.send_bytes(b'0') # ws >>>>     // bice uskoro deprecated (kad back izbaci cekanje ove poruke)

    # print(data)

    datasetlink = data['dataset']
    nnlink = data['nn']
    conflink = data['conf']
    trainrezlink = data['trainrez']
    newconf = json_decode(data['newconf'])

    # TEMP
    # conf['actPerLayer'] = ['relu' for _ in range(3)]
    # conf['neuronsPerLayer'] = [3 for _ in range(3)]
    # uid = randint(1,1)
    # nnid = randint(1,1)

    tt: TrainingThread = None

    buff: List[bytes] = []
    flags = {'stop': False}
    lock: Lock = Lock()

    EP_PACK_SIZE = 100 # broj epoha koje se salju u jednoj poruci
    trainrez_buff: List[bytes] = []

    try:
        th: Thread = None
        training_exists = TTM.nn_exist(uid, nnid)

        if training_exists:
            tt = TTM.get_tt(uid, nnid)
            buff = tt.buffer
            flags = tt.flags
            lock = tt.lock
            th = tt.thread
            print('> Thread allready exists')
        else:
            th = Thread(target=TrainingInstance(buff, lock, flags).train, args=(datasetlink, nnlink, conflink, trainrezlink, newconf), daemon=True)
            tt = TrainingThread(th, buff, flags, lock)
            TTM.add(tt, uid, nnid)
            th.start()
            print('> Thread started')

        # TTM.pretty_print()
        finished = False

        while not finished:
            
            lock.acquire(blocking=True) # [ X ]

            if len(buff) > 0:
                
                burst_buff = buff.copy()
                buff.clear()
                lock.release() # [   ]

                # -- Send EPOCHS in BURST of PACKS --
                pack = b''
                pack_i = 0

                for b in burst_buff:
                    pack_i += 1
                    if b == b'end':
                        finished = True                         # poslednja poruka za kraj
                        break
                    else:
                        pack += b + b','
                        if pack_i == EP_PACK_SIZE:              # 1 pack zavrsen, salje se
                            pack = b'[' + pack[:-1] + b']'
                            await ws.send_text(pack.decode())   # ws >>>>
                            pack = b''
                            pack_i = 0
                
                trainrez_buff.extend(burst_buff)    # cuvanje rezultata treniranja
                if finished:                        # ako je kraj sacuvati i rezultate testiranja (cuva se na pocetku bafera)
                    b = burst_buff[-1]
                    trainrez_buff = [b] + trainrez_buff
                # -- BURST Finished --

                
                print(f'>>>> send bytes: {b}')

            else:
                lock.release() # [   ]

        # Cuvanje trainrez rezultata u fajl
        fm_trainrez = FileMngr('txt')
        fm_trainrez.create(b'\n'.join(trainrez_buff))
        httpc.put(trainrezlink, fm_trainrez.path())
        print('---- Saving to File ----')
        print(fm_trainrez.read_b())
        fm_trainrez.delete(0)

        print(f'time: { time() - start_time }')
        await ws.close(code = 1000) # ws <CLOSE>

    except WebSocketDisconnect:
        print('-=| WS Disconnect |=-')
        # raise

    except Exception:     
        print('-=| EXCEPTION |=-')
        # raise

    finally:
        print('-=| Finally - Remove Training Thread |=-')
        TTM.remove(uid, nnid)

    # TTM.pretty_print()
    # print('=='*40)

