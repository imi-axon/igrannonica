import csv
import urllib3
import httpx
from time import sleep
from typing import Callable, Coroutine, List
from os import SEEK_SET
from tempfile import TemporaryFile
import time
import threading

from typing import Dict, List
from threading import Lock
from venv import create
from fastapi import WebSocket

# import pandas as pd
import pandas as pd
from pandas import DataFrame
import tensorflow as tf
from tensorflow import keras
from keras import layers, Sequential
from keras.callbacks import Callback



# def f():
#     # zahtev za fajl
#     t1 = time.time()
#     resp = httpx.get('https://localhost:7057/Storage/csv2.csv', verify = False, headers = {'Host':'localhost:8000'})
#     t1 = time.time() - t1

#     # postojeci fajl
#     t2 = time.time()
#     new_file = open('./csv2.csv', 'wb')
#     new_file.write(resp.read())

#     new_file.close()
#     t2 = time.time() - t2

#     print(f'request: {t1}s, write: {t2}s')

# f()

# # privremeni prazan
# temp_file = TemporaryFile()

# # postojeci fajl
# print('---')
# new_file = open('./csv2.csv')
# b = bytes(new_file.read(),'UTF-8')
# #print(b)

# temp_file.write(b)
# temp_file.seek(SEEK_SET)

# new_file.close()

# #print(temp_file.read().decode())
# print('---')





# class Klasa():

#     def __init__(self) -> None:
#         self.var = 'Moja promenljiva'

#     def fun(self, f: float):
#         print(f'{self.var} : {f}')


# def funkcija(cb: Callable):
#     cb(4.5)

# #funkcija(Klasa().fun)

# a = [1,2,3]

# async def asink1(a: List):
#     print('asink: pocetak...')
#     sleep(3)
#     print('asink: kraj.')
#     a.pop()
#     return 1

# def norm():
#     print('norm: pocetak...')
#     nesto = asink1(a)
#     print('norm: kraj.')
#     return nesto

# async def asink2(prom: Coroutine):
#     print('asink: pocetak...')
#     await asink1(a)
#     print('asink: kraj.')
#     return 2


# x = norm()
# print(x)
# asink2(x)

# sleep(5)

# print(a)

class TrainingInstance():
    def train(self):
        dataset_path = keras.utils.get_file("auto-mpg.data", "http://archive.ics.uci.edu/ml/machine-learning-databases/auto-mpg/auto-mpg.data")


        column_names = ['MPG','Cylinders','Displacement','Horsepower','Weight',
                        'Acceleration', 'Model Year', 'Origin']
        raw_dataset = pd.read_csv(dataset_path, names=column_names,
                            na_values = "?", comment='\t',
                            sep=" ", skipinitialspace=True)
        dataset = raw_dataset.copy()

        dataset = dataset.dropna() #brisanje null vrednosti

        horsepowerKol = dataset['Horsepower'] #popunjavanje null vrednosti mean-om 
        horsepower_mean = horsepowerKol.mean()
        horsepowerKol.fillna(horsepower_mean,inplace=True)

        dataset['Origin'] = dataset['Origin'].map({1:'USA', 2:'Europe', 3:'Japan'}) #elemente kolone menjamo drugim vrednostima u zavisnosti od mapiranja koje prosledimo

        dataset = pd.get_dummies(dataset, prefix='', prefix_sep='') #vrsimo dummy enkodiranje kategorijske promenljive

        # Podela podataka na trening i test
        train_dataset = dataset.sample(frac=0.8,random_state=0) #80% podataka za treniranje
        test_dataset = dataset.drop(train_dataset.index) #ostalih 20% podataka za tesiranje



        train_stats = train_dataset.describe() #opsta statistika
        train_stats.pop("MPG") #ovaj atribut ignorisemo jer je ciljna promenljiva (ona koja se prediktuje)
        train_stats = train_stats.transpose()

        train_labels = train_dataset.pop('MPG') #izdvajanje ciljne promenljive
        test_labels = test_dataset.pop('MPG')

        def norm(x): #standardizacija podataka - podaci su na razlicitim skalama, pa ima smisla izvrsiti njihovu strandardizaciju
            return (x-train_stats['mean']) / train_stats['std'] 
        
        normed_train_data = norm(train_dataset)
        normed_test_data = norm(test_dataset)

        def build_model():
            model = keras.Sequential([
                layers.Dense(10, activation='relu', input_shape=[len(train_dataset.keys())]),
                layers.Dense(5, activation = 'relu'),
                layers.Dense(1, activation='linear')
            ])

            optimizer = tf.keras.optimizers.RMSprop(0.001)

            model.compile(loss='mse',
                            optimizer = optimizer,
                            metrics=['mae','mse'])
            return model

        print('build model')

        model: Sequential = build_model()
        
        j = 1

        # print('\n\n>>>>>>>> W <<<<<<<<<')
        # print(model.layers[j].get_weights()[0])
        # print('\n\n>>>>>>>> B <<<<<<<<<')
        # print(model.layers[j].get_weights()[1])

        EPOCHS = 10

        print('fit begin')
        hist = model.fit(
            normed_train_data, train_labels,
            #epochs = EPOCHS, validation_split = 0.2, verbose=1, callbacks=[cb])
            # epochs = EPOCHS, verbose=1, validation_data=(normed_test_data, test_labels))
            epochs = EPOCHS, verbose=1, validation_data=(normed_test_data, test_labels))

        # df = pd.DataFrame(hist.history)
        # print(df)

        # print('\n\n>>>>>>>> W <<<<<<<<<')
        # print(model.layers[j].get_weights()[0])
        # print('\n\n>>>>>>>> B <<<<<<<<<')
        # print(model.layers[j].get_weights()[1])

        # loss, mae, mse = model.evaluate(normed_test_data, test_labels, verbose=2)
        # print(loss)
        # print(mae)
        # print(mse)

        # loss, mae, mse = model.evaluate(normed_test_data, test_labels, verbose=2)
        # print(loss)
        # print(mae)
        # print(mse)
        
TrainingInstance().train()