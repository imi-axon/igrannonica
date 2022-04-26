import pathlib
from pyexpat import model
import random
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

import tensorflow as tf
from tensorflow import keras
from keras import layers
from keras import regularizers
from keras.models import Sequential
from keras.layers.core import Dense, Activation

from sklearn.preprocessing import StandardScaler



class TrainingService():

    #datasetAll -> celokupni dataframe
    #inputs -> lista stringova (nazivi kolona) koji su ulazi
    #outputs -> lista stringova (nazivi kolona) koji su izlazi iz mreze
    #epochs = EPOCH -> int -> broj epoha
    #learning_rate = LEARING_RATE -> float
    #regularization_rate = REG_RATE -> float
    #regularization = REGULARIZATION -> string ('L1','L2')
    #actOutput -> string ('relu', 'sigmoid', 'tanh') -> aktivaciona funkcija u output sloju => ukoliko nije navedena vrednost je "None"
    #actPerLayer -> lista stringova ('relu', 'sigmoid', 'tanh') -> aktivaciona funkcija za svaki sloj
    #nbperlayer -> lista int -> broj neurona za svaki sloj
    #metrics -> lista stringova ('mse', 'mae', 'rmse' -> za regresiju; 'precision', 'recall','accuracy')
    #type -> string -> "CLASSIFICATION"/"REGRESSION"
    #batchSize -> int
    #percentage_training -> float - [0,1] -> koliki procenat celog skupa je training skup

    def __init__(self, datasetAll, inputs, outputs, actPerLayer, nbperlayer, 
                actOutput = None, metrics = ['mse'], learning_rate = 0.1, regularization_rate = 0.1, regularization = 'L1', 
                batchSize = 1, percentage_training = 0.2, problem_type = 'REGRESSION', callbacks = [], model = None):
        self.model = model

        self.inputs = inputs
        self.outputs = outputs

        self.CALLBACKS = callbacks
        
        self.LEARNING_RATE = learning_rate
        self.OPTIMIZER = keras.optimizers.Adam(learning_rate = self.LEARNING_RATE)

        self.REG_RATE = regularization_rate
        if(regularization == 'L1'):
            self.REGULARIZATION = regularizers.L1(self.REG_RATE)
        elif (regularization == 'L2'):
            self.REGULARIZATION = regularizers.L2(self.REG_RATE)
        else:
            self.REGULARIZATION = None

        
        self.ACT_PER_LAYER = actPerLayer
        self.NB_PER_LAYER = nbperlayer

        self.METRICS = metrics
        self.TYPE = problem_type

        if(actOutput==None):
            if(type=="CLASSIFICATION"):
                self.ACT_OUTPUT = "softmax"
            elif (type=="REGRESSION"):
                self.ACT_OUTPUT = "linear"
        else:
            self.ACT_OUTPUT = actOutput

        self.BATCH_SIZE = batchSize
        self.PERCENTAGE_TRAINING = percentage_training

        self.REGRESSION_LOSS = 'mse'
        self.CLASSIFICATION_LOSS = 'categorical_crossentropy'

        # Dataframe
        self.datasetAll = datasetAll
        self.dataframe = self.load_dataframe() #dataframe koji se sastoji samo od ulaznih i izlaznih kolona
        #podela na trening i testne podatke
        self.train_dataset, self.test_dataset, self.train_labels, self.test_labels = self.train_test()
        #skaliranje podataka
        self.normed_train_dataset, self.normed_test_dataset = self.data_standardization()

        # if datasetAll != None:
        #     self.setup_dataset(datasetAll)


    # def setup_dataset(self, datasetAll):
    #     # Dataframe
    #     self.datasetAll = datasetAll
    #     self.dataframe = self.load_dataframe() #dataframe koji se sastoji samo od ulaznih i izlaznih kolona
    #     #podela na trening i testne podatke
    #     self.train_dataset, self.test_dataset, self.train_labels, self.test_labels = self.train_test()
    #     #skaliranje podataka
    #     self.normed_train_dataset, self.normed_test_dataset = self.data_standardization()


    #f-ja load_dataframe od celokupnog dataframe-a pravi dataframe koji se sastoji od kolona koje su potrebne za kreiranje neuronske mreze
    #inputs - lista stringova (nazivi kolona koji su input)
    #outputs - lista stringova (nazivi kolona koji su output)
    def load_dataframe(self):
        dataframe = pd.DataFrame()
        for column in self.inputs:
            dataframe[column] = self.datasetAll[column]
        for column in self.outputs:
            dataframe[column] = self.datasetAll[column]

        return dataframe

    #f-ja train_test - podela podataka za treniranje i testiranje
    #outputs - lista stringova (nazivi kolona koji su output)
    def train_test(self):
        train_dataset = self.dataframe.sample(frac=self.PERCENTAGE_TRAINING,random_state=0) #podaci za treniranje
        test_dataset = self.dataframe.drop(train_dataset.index) #ostalak podataka za testiranje
        
        train_labels = train_dataset.loc[:,self.outputs]
        test_labels = test_dataset.loc[:,self.outputs]
        for output in self.outputs:
            train_dataset.pop(output)
            test_dataset.pop(output)
        return train_dataset, test_dataset, train_labels, test_labels


    #vrsi se standardizacije celokupnog dataset-a
    #standardizacija podataka -> skaliranje distribucija vrednosti tako da srednja vrednost bude 0, a standardna devijacija 1
    # f-ja vraca standardizovane podatke (dataframe) koji se kasnije koriste za pravljenje neuronske mreze
    def data_standardization(self):
        scaler = StandardScaler()
        normed_train_data = scaler.fit_transform(self.train_dataset)
        #normed_train_data -> povratna vrednost je niz (array)
        normed_test_data = scaler.fit_transform(self.test_dataset)
        #normed_test_data1
        normed_train_df = pd.DataFrame(data = normed_train_data, 
                    index = self.train_dataset.index, 
                    columns = self.train_dataset.columns) # od niza pravi dataframe
        normed_test_df = pd.DataFrame(data = normed_test_data, 
                    index = self.test_dataset.index, 
                    columns = self.test_dataset.columns)
        return normed_train_df, normed_test_df


    #regression
    #def build_regression_model(self):
    #    model = Sequential()
    #    
    #    model.add(Dense(self.NB_PER_LAYER[0], kernel_regularizer = self.REGULARIZATION, input_shape=[len(self.inputs)]))
    #    model.add(Activation(self.ACT_PER_LAYER[0])) 
    #    
    #    for i in range(1, len(self.NB_PER_LAYER)):
    #        model.add(Dense(self.NB_PER_LAYER[i], kernel_regularizer = self.REGULARIZATION))
    #        model.add(Activation(self.ACT_PER_LAYER[i])) 
    #    
    #    model.add(Dense(1))
    #
    #    model.compile(loss = self.REGRESSION_LOSS,
    #            optimizer = self.OPTIMIZER,
    #            metrics = self.METRICS)
    #    
    #    return model

    #classification
    #def build_classification_model(self):
    #    model = Sequential()
    #
    #    model.add(Dense(self.NB_PER_LAYER[0], kernel_regularizer = self.REGULARIZATION, input_shape=[len(self.inputs)], activation = self.ACT_PER_LAYER[0]))
    #    
    #    for i in range(1, len(self.NB_PER_LAYER)):
    #        model.add(Dense(self.NB_PER_LAYER[i], kernel_regularizer = self.REGULARIZATION, activation=self.ACT_PER_LAYER[i]))
    #        
    #    #izlazni sloj
    #    model.add(Dense(len(self.outputs), activation='softmax'))
    #
    #    model.compile(loss = self.CLASSIFICATION_LOSS,
    #            optimizer = self.OPTIMIZER,
    #            metrics = self.METRICS)
    #
    #    return model

    def build_model(self):
        model = Sequential()

        print(' -- BUILD MODEL -- ')
        print(f'inputs            : {self.inputs}')
        print(f'neurons per layer : {self.NB_PER_LAYER}')
        print(f'act per layer     : {self.ACT_PER_LAYER}')

        model.add(Dense(self.NB_PER_LAYER[0], kernel_regularizer = self.REGULARIZATION, input_shape=[len(self.inputs)], activation = self.ACT_PER_LAYER[0]))
        
        for i in range(1, len(self.NB_PER_LAYER)):
            model.add(Dense(self.NB_PER_LAYER[i], kernel_regularizer = self.REGULARIZATION, activation=self.ACT_PER_LAYER[i]))
            
        #izlazni sloj
        if(self.TYPE=="REGRESSION"):
            model.add(Dense(1, activation = self.ACT_OUTPUT))
        elif(self.TYPE=="CLASSIFICATION"):
            model.add(Dense(len(self.outputs), activation=self.ACT_OUTPUT))

        model_loss = self.REGRESSION_LOSS
        if(self.TYPE=="CLASSIFICATION"):
            model_loss = self.CLASSIFICATION_LOSS

        model.compile(loss = model_loss,
                optimizer = self.OPTIMIZER,
                metrics = self.METRICS)

        # print(model)
        return model



    #obucavanje modela
    def fit_model(self, model, epoch, val_split = 0.2):
        history = model.fit(self.normed_train_dataset, self.train_labels, 
                            epochs = epoch, batch_size = self.BATCH_SIZE, 
                            validation_split = val_split, 
                            verbose=0, callbacks=self.CALLBACKS)

        return history.history


    def evaluate_model(self, model):
        results = model.evaluate(self.normed_test_dataset, self.test_labels, verbose = 0)

        return results


    def predict_model(self, model):
        predictions = model.predict(self.test_dataset)

        return predictions


    # Metode za eksternu upotrebu

    def new_model(self):
        self.model = self.build_model()
        return self.model

    def load_model(self, filepath: str):
        self.model = tf.keras.models.load_model(filepath)

    def save_model(self, path: str, name: str):
        model_path = path + name
        self.model.save(model_path)
        return model_path


    def start_training(self, epoch, val_split):

        if self.model == None:
            self.new_model()
        self.new_model()

        self.fit_model(self.model, epoch, val_split)
        # for i in range(10):
        #     print(f'TRAIN {i}')
        #     self.fit_model(self.model, epoch, val_split)

        print('TRAINING FINISHED')

        # results = self.evaluate_model(model)
        # predictions = self.predict_model(model)

        #return model_path
