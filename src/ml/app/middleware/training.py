from asyncio import streams
from codecs import StreamReader
from fastapi import WebSocket, WebSocketDisconnect
import pandas as pd
import tensorflow as tf
from tensorflow import keras
from keras import layers

from typing import Callable


class EpochEndCallback(keras.callbacks.Callback):

    def addMyCallbackFunction(self, cbfn: Callable):
        print('>>>>>>>>>>>> DODAT CALLBACK')
        self.myCallbackFunction = cbfn

    def on_epoch_end(self, epoch, logs=None):
        print(f'>>>> on epoch end | {epoch}')
        self.myCallbackFunction(epoch, logs, ['loss', 'mean_absolute_error'])

class TrainingInstance():

    def __init__(self, epcb: Callable = lambda:1):
        self.epcb = epcb

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
                layers.Dense(1)
            ])

            optimizer = tf.keras.optimizers.RMSprop(0.001)

            model.compile(loss='mse',
                            optimizer = optimizer,
                            metrics=['mae','mse'])
            return model


        model: keras.Sequential = build_model()

        EPOCHS = 10

        # cb = EpochEndCallback()
        # cb.addMyCallbackFunction(self.epcb)
        hist = model.fit(
            normed_train_data, train_labels,
            #epochs = EPOCHS, validation_split = 0.2, verbose=1, callbacks=[cb])
            epochs = EPOCHS, validation_split = 0.2, verbose=1)

        df = pd.DataFrame(hist.history)
        print(df)



        j = 0

        print(model.layers[j].get_config())

        print('\n\n>>>>>>>> [0] <<<<<<<<<')
        we = model.layers[j].get_weights()[0]
        print(len(we))
        print(we)
        x = []
        for w in we:
            x.extend(w)
        print(len(x))
        print(x)

        print('\n\n>>>>>>>> [1] <<<<<<<<<')
        print(model.layers[j].get_weights()[1])


class WsConn():

    def __init__(self) -> None:
        self.str: StreamReader = streams.StreamReader()
        

    async def set(self, ws: WebSocket):
        self.ws: WebSocket = ws
        await self.ws.accept()
        self.tr: TrainingInstance = TrainingInstance(self.send)
        self.tr.train()


    async def send(self, epoch, log, stats):
        print(f'<< epoch end >> {epoch}: {log[stats[0]]}')
        try:
            await self.ws.send_text(str(log[stats[0]]))
        except WebSocketDisconnect:
            pass
        

TrainingInstance().train()