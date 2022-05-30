from threading import Lock, Thread
from time import time
from typing import List

# Cofigs
import config as cfg # Ne koristi se ali treba da se importuje

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
from util.runb import runb, alock, aunlock

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
    sm = StatisticsMiddleware(df)
    _ , stats = sm.get_stat() # _ zanemaruje se json string reprezentacija stats recnika
    metadata['statistics'] = stats
    metadata = MetadataService().updateTrainReady(metadata, stats)
    
    fm_meta = FileMngr('json')
    fm_meta.create(sm.to_json(metadata))
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

    # def_conf = {
    #     'inputs' :          inputs,
    #     'outputs' :         outputs,
    #     'neuronsPerLayer' : [3, 2],
    #     'actPerLayer' :     ['relu', 'relu'],
    #     'actOut' :          'linear',
    #     'learningRate' :    0.1,
    #     'reg' :             'L1',
    #     'regRate' :         0.1,
    #     'batchSize' :       1,
    #     'trainSplit' :      0.7,
    #     'valSplit' :        0.1
    # }
    
    nnmodel = NNModelMiddleware()
    def_conf = nnmodel.new_default_model_2(inputs, outputs) # vraca konfiguraciju za napravljeni model
    
    fm = FileMngr('h5')
    nnmodel.save_model(fm.directory(), fm.name())
    httpc.put(body.nn, fm.path())
    fm.delete(0)

    fc = FileMngr('json')
    fc.create(json_encode(def_conf))
    httpc.put(body.conf, fc.path())
    fc.delete(0)


@app.post('/api/nn/meta/generate')
def generate_metadata(body: MetaGenRequest):

    dataset = httpc.get(body.dataset)
    dialect = get_csv_dialect(dataset)
    df = read_str_to_df(dataset, dialect.delimiter, dialect.quotechar)

    metadata = MetadataService().generate(df)
    sm = StatisticsMiddleware(df)
    _ , stats = sm.get_stat()
    metadata['statistics'] = stats

    # print('PRINT METADATA')
    # print(metadata)
    # print('---------')
    # print(sm.to_json(metadata))

    fm_meta = FileMngr('json')
    # fm_meta.create(json_encode(metadata))
    fm_meta.create(sm.to_json(metadata))

    httpc.put(body.metaedit, fm_meta.path())
    httpc.put(body.metamain, fm_meta.path())

    fm_meta.delete(0)


# ==== Training ====

@app.get('/api/user{uid}/nns')
def get_nn_list(uid: int):
    try:
        TTM.b_table_lock() # TTM [ X ]
        tts = TTM.get_user_nns(uid)
        nns = []
        if tts != None:
            for (key,val) in tts.items():
                nns.append( { str(key) : json_decode(val.buffer[-1].decode('utf-8')) } )
        return json_encode(nns)
        
    finally:
        TTM.b_table_unlock() # TTM [  ]


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
    TTM.b_table_lock() # TTM [ X ]
    if TTM.nn_exist(uid, nnid):
        tt = TTM.get_tt(uid, nnid)
        TTM.b_table_unlock() # TTM [   ]
        tt.lock.acquire(blocking=True)
        tt.flags['stop'] = True
        tt.lock.release()
    else:
        TTM.b_table_unlock() # TTM [  ]


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

    print(datasetlink)
    print(nnlink)
    print(conflink)
    print(trainrezlink)
    # print(newconf)

    # TEMP
    # conf['actPerLayer'] = ['relu' for _ in range(3)]
    # conf['neuronsPerLayer'] = [3 for _ in range(3)]
    # uid = randint(1,1)
    # nnid = randint(1,1)

    tt: TrainingThread = None

    buff: List[bytes] = []
    flags = {'stop': False}
    lock: Lock = Lock()

    EP_PACK_SIZE_MAX = 100      # maximalan broj epoha koje se salju u jednoj poruci
    EP_PACK_SIZE_MIN = 1        # minimalan broj epoha koje se salju u jednoj poruci
    trainrez_buff: List[bytes] = []

    try:
        th: Thread = None
        print('1 ------')
        await TTM.table_lock() # TTM [ X ]
        training_exists = TTM.nn_exist(uid, nnid)

        if training_exists:
            # Treniranje ove mreze je u toku, zapoceti pracenje
            tt = TTM.get_tt(uid, nnid)
            await TTM.table_unlock() # TTM [   ]
            buff = tt.buffer
            flags = tt.flags
            lock = tt.lock
            th = tt.thread
            print('> Thread allready exists')
        else:
            # Treniranje ove mreze nije u toku, zapoceti novo treniranje
            th = Thread(target=TrainingInstance(buff, lock, flags).train, args=(datasetlink, nnlink, conflink, trainrezlink, newconf), daemon=True)
            tt = TrainingThread(th, buff, flags, lock)
            TTM.add(tt, uid, nnid)
            await TTM.table_unlock() # TTM [   ]
            th.start()
            print('> Thread started')

        # TTM.pretty_print()
        finished = False
        ibuf = 0 # redni broj poruke u baferu koja sledeca treba da se procita

        while not finished:
            
            await alock(lock) # [ X ]

            if (not th.is_alive()) and flags['stop'] == False:
                raise Exception()

            if len(buff) >= ibuf + EP_PACK_SIZE_MIN:
                
                burst_buff = buff[ibuf:].copy()                 # kopira se sadrzaj bafera od ibuf-a do kraja
                await aunlock(lock) # [   ]
                ibuf += len(burst_buff)                         # ibuf postaje redni broj elementa u nizu od koga ce se sledeci put pokupiti sadrzaj bafera

                # -- Send EPOCHS in BURST of PACKS --
                pack = b''
                pack_i = 0
                bb_len = len(burst_buff)

                for b in burst_buff:
                    pack_i += 1
                    if b == b'end':
                        finished = True                         # poslednja poruka za kraj
                        break
                    else:
                        pack += b + b','
                        if pack_i == EP_PACK_SIZE_MAX:          # 1 pack zavrsen, salje se
                            pack = b'[' + pack[:-1] + b']'
                            print('>>>> send one pack >>>>')
                            await ws.send_text(pack.decode())   # ws >>>>
                            pack = b''
                            pack_i = 0
                
                # Ukoliko je preostalo nesto epoha kojih nema dovoljno za jedan PACK
                if pack != b'':
                    pack = b'[' + pack[:-1] + b']'
                    print('>>>> send remaining >>>>')
                    await ws.send_text(pack.decode())   # ws >>>>

                if finished:                            # ako je kraj sacuvati i rezultate testiranja (cuva se na pocetku bafera)
                    trainrez_buff.extend(burst_buff[:-2])    # cuvanje rezultata treniranja (bez "end" i testrez)
                    b = burst_buff[-1]
                    trainrez_buff = [b] + trainrez_buff
                else:
                    trainrez_buff.extend(burst_buff)    # cuvanje rezultata treniranja (ceo buffer ukoliko su u njemu samo epohe)
                # -- BURST Finished --

                # print(f'>>>> send bytes: {b}')

            else:
                await aunlock(lock) # [   ]

        # Cuvanje trainrez rezultata u fajl
        def save_trainrez_to_file():
            fm_trainrez = FileMngr('txt')
            fm_trainrez.create(b'[' + b','.join(trainrez_buff) + b']')
            httpc.put(trainrezlink, fm_trainrez.path())
            print('---- Saving to File ----')
            print(fm_trainrez.read_b())
            fm_trainrez.delete(0)
        await runb(save_trainrez_to_file)

        await TTM.table_lock() # TTM [ X ]
        TTM.remove(uid, nnid)
        await TTM.table_unlock() # TTM [   ]

        print(f'time: { time() - start_time }')
        await ws.close(code = 1000) # ws <CLOSE>

    except WebSocketDisconnect:
        print('-=| WS Disconnect |=-')

    except Exception:     
        print('-=| EXCEPTION => Remove Training Thread |=-')
        await TTM.table_lock() # TTM [ X ]
        TTM.remove(uid, nnid)
        await TTM.table_unlock() # TTM [   ]
        raise

    finally:
        print('-=| Finally |=-')
        TTM.pretty_print()
        print('=='*25)

