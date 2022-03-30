import pathlib
from pyexpat import model
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
    #actGlobal -> string ('relu', 'sigmoid', 'tanh') -> aktivaciona funkcija
    #actPerLayer -> lista stringova ('relu', 'sigmoid', 'tanh') -> aktivaciona funkcija za svaki sloj
    #nbperlayer -> lista int -> broj neurona za svaki sloj
    #metrics -> lista stringova ('mse', 'mae', 'rmse' -> za regresiju; 'precision', 'recall','accuracy')
    def __init__(self, datasetAll,inputs, outputs, epochs, learning_rate, regularization_rate,regularization, actGlobal, actPerLayer, nbperlayer, metrics):
        self.datasetAll = datasetAll
        self.inputs = inputs
        self.outputs = outputs

        self.EPOCHS = epochs
        
        self.LEARNING_RATE = learning_rate
        self.OPTIMIZER = keras.optimizers.Adam(learning_rate = self.LEARNING_RATE)

        self.REG_RATE = regularization_rate
        if(regularization == 'L1'):
            self.REGULARIZATION = regularizers.L1(self.REG_RATE)
        elif (regularization == 'L2'):
            self.REGULARIZATION = regularizers.L2(self.REG_RATE)

        self.ACT_GLOBAL = actGlobal
        self.ACT_PER_LAYER = actPerLayer
        self.NB_PER_LAYER = nbperlayer

        self.METRICS = metrics

        self.REGRESSION_LOSS = 'mse'
        
        self.dataframe = self.load_dataframe() #dataframe koji se sastoji samo od ulaznih i izlaznih kolona

        #podela na trening i testne podatke
        self.train_dataset, self.test_dataset, self.train_labels, self.test_labels = self.train_test()

        #skaliranje podataka
        self.normed_train_dataset, self.normed_test_dataset = self.data_standardization()

        


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
        train_dataset = self.dataframe.sample(frac=0.8,random_state=0) #80% podataka za treniranje
        test_dataset = self.dataframe.drop(train_dataset.index) #ostalih 20% podataka za testiranje
        
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
    def build_model(self):
        model = Sequential()
        
        model.add(Dense(len(self.inputs), kernel_regularizer = self.REGULARIZATION, input_shape=[len(self.inputs)]))
        model.add(Activation(self.ACT_PER_LAYER[0])) 
        
        for i in range(0, len(self.NB_PER_LAYER)):
            model.add(Dense(self.NB_PER_LAYER[i], kernel_regularizer = self.REGULARIZATION))
            model.add(Activation(self.ACT_PER_LAYER[i+1])) 
        
        model.add(Dense(1))

        model.compile(loss = self.REGRESSION_LOSS,
                optimizer = self.OPTIMIZER,
                metrics = self.METRICS)
        
        return model

    #obucavanje modela
    def fit_model(self, model):
        history = model.fit(self.normed_train_dataset, self.train_labels, 
                            epochs = self.EPOCHS, 
                            validation_split = 0.2, 
                            verbose=0)

        return history.history


    def evaluate_model(self, model):
        results = model.evaluate(self.normed_test_dataset, self.test_labels, verbose = 0)

        return results


    def predict_model(self, model):
        predictions = model.predict(self.test_dataset)

        return predictions


    def start_training(self):
        model = self.build_model()
        
        history = self.fit_model(model)

        results = self.evaluate_model(model)
        predictions = self.predict_model(model)

        return history, results, predictions
