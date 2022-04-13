from typing import Dict, List
from threading import Lock
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
        to_stop = self.flags['stop']
        
        if to_stop:
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
        dataframe = pandas.read_csv(f.path(), sep = ';')
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
            , percentage_training = trainConf['trainSplit']
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

        self.service.start_training(10, trainConf['valSplit'])              # na kraju treninga ima lock.acquire() # [ X ]
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
        print('-- Poruka za kraj Thread-a --')

        self.lock.acquire(blocking=True)    # [ X ]
        self.buff.append(b'')               # indikator za kraj Thread-a
        self.lock.release()                 # [   ]





    # def train(self):
    #     dataset_path = keras.utils.get_file("auto-mpg.data", "http://archive.ics.uci.edu/ml/machine-learning-databases/auto-mpg/auto-mpg.data")


    #     column_names = ['MPG','Cylinders','Displacement','Horsepower','Weight',
    #                     'Acceleration', 'Model Year', 'Origin']
    #     raw_dataset = pd.read_csv(dataset_path, names=column_names,
    #                         na_values = "?", comment='\t',
    #                         sep=" ", skipinitialspace=True)
    #     dataset = raw_dataset.copy()

    #     dataset = dataset.dropna() #brisanje null vrednosti

    #     horsepowerKol = dataset['Horsepower'] #popunjavanje null vrednosti mean-om 
    #     horsepower_mean = horsepowerKol.mean()
    #     horsepowerKol.fillna(horsepower_mean,inplace=True)

    #     dataset['Origin'] = dataset['Origin'].map({1:'USA', 2:'Europe', 3:'Japan'}) #elemente kolone menjamo drugim vrednostima u zavisnosti od mapiranja koje prosledimo

    #     dataset = pd.get_dummies(dataset, prefix='', prefix_sep='') #vrsimo dummy enkodiranje kategorijske promenljive

    #     # Podela podataka na trening i test
    #     train_dataset = dataset.sample(frac=0.8,random_state=0) #80% podataka za treniranje
    #     test_dataset = dataset.drop(train_dataset.index) #ostalih 20% podataka za tesiranje



    #     train_stats = train_dataset.describe() #opsta statistika
    #     train_stats.pop("MPG") #ovaj atribut ignorisemo jer je ciljna promenljiva (ona koja se prediktuje)
    #     train_stats = train_stats.transpose()

    #     train_labels = train_dataset.pop('MPG') #izdvajanje ciljne promenljive
    #     test_labels = test_dataset.pop('MPG')

    #     def norm(x): #standardizacija podataka - podaci su na razlicitim skalama, pa ima smisla izvrsiti njihovu strandardizaciju
    #         return (x-train_stats['mean']) / train_stats['std'] 
        
    #     normed_train_data = norm(train_dataset)
    #     normed_test_data = norm(test_dataset)

    #     def build_model():
    #         model = keras.Sequential([
    #             layers.Dense(10, activation='relu', input_shape=[len(train_dataset.keys())]),
    #             layers.Dense(5, activation = 'relu'),
    #             layers.Dense(1, activation='linear')
    #         ])

    #         optimizer = tf.keras.optimizers.RMSprop(0.001)

    #         model.compile(loss='mse',
    #                         optimizer = optimizer,
    #                         metrics=['mae','mse'])
    #         return model

    #     print('build model')

    #     model: Sequential = build_model()
        
    #     j = 1

    #     # print('\n\n>>>>>>>> W <<<<<<<<<')
    #     # print(model.layers[j].get_weights()[0])
    #     # print('\n\n>>>>>>>> B <<<<<<<<<')
    #     # print(model.layers[j].get_weights()[1])

    #     EPOCHS = 100

    #     print('new cb')
    #     cb = EpochEndCallback()
    #     cb.set_my_params_2(self.ws, self.buff, self.lock)
    #     print('fit begin')
    #     hist = model.fit(
    #         normed_train_data, train_labels,
    #         #epochs = EPOCHS, validation_split = 0.2, verbose=1, callbacks=[cb])
    #         # epochs = EPOCHS, verbose=1, validation_data=(normed_test_data, test_labels))
    #         epochs = EPOCHS, verbose=0, validation_data=(normed_test_data, test_labels), callbacks=[cb])

    #     self.buff.append(b'')

    #     f = FileMngr('h5')
    #     f.create(b'ranodmpodaci')
    #     f.delete()

    #     self.buff.append(bytes(f.path(), 'utf-8'))

    #     # df = pd.DataFrame(hist.history)
    #     # print(df)

    #     # print('\n\n>>>>>>>> W <<<<<<<<<')
    #     # print(model.layers[j].get_weights()[0])
    #     # print('\n\n>>>>>>>> B <<<<<<<<<')
    #     # print(model.layers[j].get_weights()[1])

    #     # loss, mae, mse = model.evaluate(normed_test_data, test_labels, verbose=2)
    #     # print(loss)
    #     # print(mae)
    #     # print(mse)

    #     # loss, mae, mse = model.evaluate(normed_test_data, test_labels, verbose=2)
    #     # print(loss)
    #     # print(mae)
    #     # print(mse)
        
# TrainingInstance().train()