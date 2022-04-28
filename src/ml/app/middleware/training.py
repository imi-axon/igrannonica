from csv import Dialect
from typing import Dict, List
from threading import Lock, Thread, current_thread
from venv import create
from fastapi import WebSocket

# import pandas as pd
import pandas
from pandas import DataFrame
import tensorflow as tf
from tensorflow import keras
from keras import layers, Sequential
from keras.callbacks import Callback

import util.http as httpc
from util.filemngr import FileMngr
from util.json import json_encode
import util.http as httpc
from util.csv import get_csv_dialect

from services.trainingmodel import TrainingService


class TrainingCallback(Callback):

    def set_custom_params(self, buff: List[bytes], lock: Lock, flags):
        self.buff = buff
        self.lock = lock
        self.flags = flags

    def on_epoch_begin(self, epoch, logs=None):
        self.lock.acquire(blocking=True) # [ LOCK ]
        print(f'>>>> {epoch}. epoch end [ LOCK ]')
        
    def on_epoch_end(self, epoch, logs=None):
        data = { 'epoch' : epoch, 't_loss' : logs['loss'], 'v_loss' : logs['val_loss'] }
        self.buff.append(bytes(json_encode(data), encoding='utf-8'))

        print(f'>>>> {epoch}. epoch end [ UNLOCK ]')
        
        if self.flags['stop']:
            self.model.stop_training = True
        
        self.lock.release() # [ UNLOCK ]


    def on_train_end(self, logs=None):
        self.lock.acquire(blocking=True) # [ LOCK ]
        self.flags['stop'] = True

    

class TrainingInstance():

    def __init__(self, buff: List[bytes], lock: Lock, flags):
        print('Train Instance Construcotor : BEGIN')
        self.buff = buff
        self.lock = lock
        self.flags = flags
        self.callback = TrainingCallback()
        self.callback.set_custom_params(buff, lock, flags)
        self.service = None
        self.lock.acquire(blocking=True) # [ LOCK ]
        print('Train Instance Construcotor : END')
        

    def create_dataset(self, datasetUrl: str):
        # Create file
        datasetStr: str = httpc.get(datasetUrl)
        f = FileMngr('csv')
        f.create(datasetStr)
        # Create dataframe
        dialect: Dialect = get_csv_dialect(datasetStr)
        dataframe = pandas.read_csv(f.path(), sep = dialect.delimiter, quotechar = dialect.quotechar)
        f.delete()
        return dataframe

    def create_model(self, nnUrl) -> FileMngr: #  return file mngr
        loaded_model: bytes = httpc.get(nnUrl, decode=False)
        fmngr = FileMngr('h5')
        fmngr.create(loaded_model)
        return fmngr

    def create_service(self, dataframe, trainConf: Dict):
        self.service = TrainingService(dataframe, trainConf['inputs'], trainConf['outputs'], trainConf['actPerLayer'], trainConf['neuronsPerLayer']
            , learning_rate = trainConf['learningRate']
            , regularization_rate = trainConf['regRate']
            , regularization = trainConf['reg']
            , batchSize = trainConf['batchSize']
            #, percentage_training = trainConf['trainSplit']
            , callbacks=[self.callback]
        
        ) if self.service == None else self.service

    # def new_model(self, trainConf: Dict):
    #     self.create_service(None, trainConf)
    #     return self.service.new_model()

    def train(self, datasetUrl: str, nnUrl: str, trainConf: Dict):

        print('Train Function : BEGIN')

        # -- Inicijalni setup --
        print('-- Inicijalni setup --')

        dataframe = self.create_dataset(datasetUrl)     # dataframe
        fm_model = self.create_model(nnUrl)             # h5 FileMngr
        self.create_service(dataframe, trainConf)       # service
        self.service.load_model(fm_model.path())        # load h5 model
        # self.service.new_model()                        # poziva se odvojeno od start_training da bi bilo iznad UNLOCK-a, zbog performansi
        self.lock.release()                             # zbog lock-a u konstruktoru # [   ]

        # -- Treniranje --
        print('-- Treniranje --')

        #self.service.start_training(100, trainConf['valSplit'])              # na kraju treninga ima lock.acquire() # [ X ]
        self.service.start_training(1000, 0.2)
        self.service.save_model(fm_model.directory(), fm_model.name())      # h5 fajl sa putanjom za koju je vezan fm_model FileMngr
        self.lock.release()                                                 # zbog lock-a na kraju treniranja # [   ]
        
        # -- Poruka za kraj treniranja --
        print('-- Poruka za kraj treniranja --')

        self.lock.acquire(blocking=True)    # [ X ]
        self.buff.append(b'end')            # indikator za kraj treniranja 
        self.lock.release()                 # [   ]

        # -- POST Request, cuvanje h5 modela --

        # httpc.put(nnUrl) # PRIVREMENO ZAKOMENTARISANO DOK BACK NE URADI PODRSKU

        # -- Poruka za kraj Thread-a --
        # print('-- Poruka za kraj Thread-a --')

        # self.lock.acquire(blocking=True)    # [ X ]
        # self.buff.append(b'')               # indikator za kraj Thread-a
        # print(self.buff)
        # self.lock.release()                 # [   ]

        print('-'*20)
