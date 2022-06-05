from csv import Dialect
from time import time
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
from util.json import json_encode, json_decode
from util.csv import get_csv_dialect

from .util import compareConfigurations

from services.trainingmodel import TrainingService


class TrainingCallback(Callback):

    def set_custom_params(self, buff: List[bytes], lock: Lock, flags):
        self.buff = buff
        self.lock = lock
        self.flags = flags

    def on_epoch_begin(self, epoch, logs=None):
        self.lock.acquire(blocking=True) # [ LOCK ]
        print(f'>>>> {epoch}. epoch begin [ LOCK ]')
        
    def on_epoch_end(self, epoch, logs=None):
        # data = { 'epoch' : epoch, 't_loss' : logs['loss'], 'v_loss' : logs['val_loss'] }
        logs['epoch'] = epoch
        data = logs
        print(data)
        self.buff.append(bytes(json_encode(data), encoding='utf-8'))

        print(f'>>>> {epoch}. epoch end [ UNLOCK ]')
        
        if self.flags['stop']:
            self.model.stop_training = True
        
        # print('on epoch end UNLOCK')
        self.lock.release() # [ UNLOCK ]


    def on_train_end(self, logs=None):
        print('------------------ ON TRAIN END')
        print(logs)
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
        loaded_model: bytes = httpc.get(nnUrl, False)
        print('httpc returned')
        fmngr = FileMngr('h5')
        fmngr.create(loaded_model)
        return fmngr


    def create_service(self, dataframe, trainConf: Dict):
        # check
        if list(trainConf.keys()).count('metrics') == 0:
            trainConf['metrics'] = []

        actpl = trainConf['actPerLayer']
        actpl = [a.lower() for a in actpl]
        self.service = TrainingService(dataframe, trainConf['inputs'], trainConf['outputs'], actpl, trainConf['neuronsPerLayer']
            , actOutput = trainConf['actOut'].lower()
            , learning_rate = trainConf['learningRate']
            , regularization_rate = trainConf['regRate']
            , regularization = trainConf['reg']
            , batchSize = trainConf['batchSize']
            , percentage_training = trainConf['trainSplit']
            , percentage_validation = trainConf['valSplit']
            , callbacks=[self.callback]
            , problem_type = trainConf['problemType']
            , metrics = trainConf['metrics']
            , loss = trainConf['loss']
            , optimizer = trainConf['trainAlg']
        ) if self.service == None else self.service


    def load_model(self, filepath, conf, newconf):
        to_load_model = compareConfigurations(conf, newconf)
        if to_load_model:
            self.service.load_model(filepath)


    def train(self, datasetUrl: str, nnUrl: str, confUrl: str, trainrezUrl: str, newconf: Dict, nnid: int):

        try:
            print('Train Function : BEGIN')

            # -- Inicijalni setup --
            print('-- Inicijalni setup --')

            oldconf = json_decode(httpc.get(confUrl))                   # stara konfiguracija
            updateConf = not compareConfigurations(oldconf, newconf)        # da li se nova konfiguracija razlikuje od stare
            trainConf = newconf if updateConf else oldconf              # izbor konfiguracije za kreiranje servisa za treniranje
            print(updateConf)
            print(trainConf)
            dataframe = self.create_dataset(datasetUrl)                 # dataframe
            fm_model = self.create_model(nnUrl)                         # h5 FileMngr
            self.create_service(dataframe, trainConf)                   # service
            if not updateConf:
                print('<<<<< LOAD MODEL >>>>>')                                              
                self.service.load_model(fm_model.path())                # load h5 model (ako treba)
            self.lock.release()                                         # zbog lock-a u konstruktoru # [   ]
            print('thread lock unlocked')
            print(self.lock.locked())

            # -- Treniranje --
            print('-- Treniranje --')

            tbegin = time()                                                                         # vreme pre pocetka treniranja
            testrez = self.service.start_training(int(trainConf['epochsDuration']))                 # na kraju treninga ima lock.acquire(blocking=True) # [ X ]
            tend = time()                                                                           # vreme po zavrsetku treniranja
            trained_model_fpath = self.service.save_model(fm_model.directory(), fm_model.name())    # h5 fajl sa putanjom za koju je vezan fm_model FileMngr
            self.lock.release()                                                                     # zbog lock-a na kraju treniranja # [   ]
            
            # -- Cuvanje fajlova u Storate na Backu --

            fm_conf = FileMngr('json')
            fm_conf.create(json_encode(trainConf))
            httpc.put(nnUrl, trained_model_fpath)
            httpc.put(confUrl, fm_conf.path())


            # -- Poruka za kraj treniranja --
            print('-- Poruka za kraj treniranja --')

            print(testrez)
            self.lock.acquire(blocking=True)                            # [ X ]
            self.buff.append(b'end')                                    # indikator za kraj treniranja 
            self.buff.append(bytes(json_encode(testrez), 'utf-8'))      # rezultati testiranja ('end' i 'testrez' ce se uvek naci zajedno u baferu jer je ovaj blok atomican)
            self.buff.append(bytes(str(tend-tbegin), 'utf-8'))          # vreme koliko je trajalo treniranje (u sekundama)
            self.lock.release()                                         # [   ]

            # -- Brisanje fajlova --
            fm_model.delete(0)
            fm_conf.delete(0)

            # Cuvanje trainrez rezultata u fajl
            buff = self.buff[-3:][1:] + self.buff[:-3]                  # na pocetak se prebacuju 'time' i 'test_rez', bez 'end'-a
            fm_trainrez = FileMngr('txt')
            fm_trainrez.create(b'[' + b','.join(buff) + b']')
            httpc.put(trainrezUrl, fm_trainrez.path())
            print('---- Saving to File ----')
            print(fm_trainrez.read_b())
            fm_trainrez.delete(0)

            # -- Poruka za kraj Thread-a --
            # print('-- Poruka za kraj Thread-a --')

            # self.lock.acquire(blocking=True)    # [ X ]
            # self.buff.append(b'')               # indikator za kraj Thread-a
            # print(self.buff)
            # self.lock.release()                 # [   ]


            print('-'*20)

        except:
            if self.lock.locked():      # ako je try deo pukao i lock je ostao zakljucan otkljucati ga
                self.lock.release()
            raise

        finally:
            print('training thread FINALLY')
            httpc.train_stop(nnid)      # poruka backu za train stop