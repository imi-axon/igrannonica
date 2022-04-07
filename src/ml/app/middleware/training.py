from typing import List
from threading import Lock
from fastapi import WebSocket

# import pandas as pd
import pandas
from pandas import DataFrame
import tensorflow as tf
from tensorflow import keras
from keras import layers, Sequential

from util.filemngr import FileMngr
import util.http as httpc
from services.trainingmodel import TrainingService

class EpochEndCallback(keras.callbacks.Callback):

    def set_custom_params(self, buff: List[bytes], lock: Lock):
        self.buff = buff
        self.lock = lock

    def on_epoch_end(self, epoch, logs=None):
        print(f'>>>> on epoch end | {epoch}')
        self.lock.acquire(blocking=True)
        self.buff.append(bytes(f"{logs['loss']} {logs['val_loss']}", encoding='utf-8'))
        self.lock.release()
        print(f'>>>> on epoch end | {epoch}')

class TrainingInstance():

    def __init__(self, buff: List[bytes], lock: Lock):
        self.buff = buff
        self.lock = lock
        self.callback = EpochEndCallback()
        self.callback.set_custom_params(buff, lock)
        

    def train(self, datasetUrl: str, nnUrl: str, inputNames: List[str], outputNames: List[str]):

        # Create file
        datasetStr: str = httpc.get(datasetUrl)
        f = FileMngr('csv')
        f.create(datasetStr)
        
        print('csv file created')

        print(f.path())
        # Dataframe setup
        dataframe = pandas.read_csv(f.path(), sep = ';')

        print(dataframe)


        ts = TrainingService(dataframe, inputNames, outputNames
            , epochs=10
            , learning_rate=0.01
            , regularization_rate=0.1
            , regularization='L1'
            , nbperlayer=[10,10,10]
            , actPerLayer=['relu', 'relu', 'relu']
            , metrics=['mse']
            , batchSize=1
            , percentage_training=0.3
            , type='REGRESSION'
            , callbacks=[self.callback]
        )

        ts.start_training()

        # training end
        self.buff.append(b'')
        f.delete(1)

        # file
        f = FileMngr('h5')
        f.create(b'ranodmpodaci')
        f.delete()

        # self.buff.append(bytes(('{ "path": "' + f.path() + '"}'), 'utf-8'))
        self.buff.append(b'nekibezvezetekst')


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