import pathlib
from pyexpat import model
import random
from time import sleep
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
from sklearn.preprocessing import MinMaxScaler

from .util import MCC
from .util import ActivationFunctionsCodeConverter

class TrainingService():

    #datasetAll -> celokupni dataframe
    #inputs -> lista stringova (nazivi kolona) koji su ulazi
    #outputs -> lista stringova (nazivi kolona) koji su izlazi iz mreze
    #epochs = EPOCH -> int -> broj epoha
    #learning_rate = LEARING_RATE -> float
    #regularization_rate = REG_RATE -> float
    #regularization = REGULARIZATION -> string ('L1','L2')
    #actOutput -> string ('relu', 'sigmoid', 'tanh') -> aktivaciona funkcija u output sloju => ukoliko nije navedena vrednost je None
    #actPerLayer -> lista stringova ('relu', 'sigmoid', 'tanh') -> aktivaciona funkcija za svaki sloj
    #nbperlayer -> lista int -> broj neurona za svaki sloj
    #metrics -> lista stringova ('mse', 'mae', 'rmse' -> za regresiju; 'precision', 'recall','accuracy')
    #type -> string -> "CLASSIFICATION"/"REGRESSION"
    #batchSize -> int
    #percentage_training -> float - [0,1] -> koliki procenat celog skupa je training skup
    #percentage_validation -> float - [0,1] -> koliki procenat celog skupa je validacioni skup
    # FULL_MODE - ako je False preskace se deo sa skupom podataka (sluzi samo ako ce se servis koristiti iskljucivo za kreiranje modela)
    def __init__(self, datasetAll, inputs, outputs, actPerLayer, nbperlayer, 
                actOutput = None, loss = 'mean_squared_error', metrics = ['mean_squared_error'], learning_rate = 0.1, optimizer = 'adam', regularization_rate = 0.1, regularization = 'L1', 
                batchSize = 1, percentage_training = 0.6, percentage_validation = 0.2, problem_type = 'REGRESSION', callbacks = []
                , FULL_MODE = True):
        
        problem_type = problem_type.upper()

        self.model = None

        self.inputs = inputs
        self.outputs = outputs

        self.CALLBACKS = callbacks
        
        self.LEARNING_RATE = learning_rate
        #self.OPTIMIZER = keras.optimizers.Adam(learning_rate = self.LEARNING_RATE)
        if(optimizer == 'adam'):
            self.OPTIMIZER=keras.optimizers.Adam(learning_rate = self.LEARNING_RATE)
        elif(optimizer == 'adamax'):
            self.OPTIMIZER=keras.optimizers.Adamax(learning_rate = self.LEARNING_RATE)
        elif(optimizer == 'adagrad'):
            self.OPTIMIZER=keras.optimizers.Adagrad(learning_rate = self.LEARNING_RATE)
        elif(optimizer == 'adadelta'):
            self.OPTIMIZER=keras.optimizers.Adadelta(learning_rate = self.LEARNING_RATE)
        elif(optimizer == 'nadam'):
            self.OPTIMIZER=keras.optimizers.Nadam(learning_rate = self.LEARNING_RATE)
        elif(optimizer == 'rmsprop'):
            self.OPTIMIZER=keras.optimizers.RMSprop(learning_rate = self.LEARNING_RATE)
        elif(optimizer == 'ftrl'):
            self.OPTIMIZER=keras.optimizers.Ftrl(learning_rate = self.LEARNING_RATE)
        elif(optimizer == 'sgd'):
            self.OPTIMIZER=keras.optimizers.SGD(learning_rate = self.LEARNING_RATE)
        else:
            self.OPTIMIZER=keras.optimizers.Adam(learning_rate = self.LEARNING_RATE)



        self.REG_RATE = regularization_rate
        if(regularization == 'L1'):
            self.REGULARIZATION = regularizers.L1(self.REG_RATE)
        elif (regularization == 'L2'):
            self.REGULARIZATION = regularizers.L2(self.REG_RATE)
        else:
            self.REGULARIZATION = None

        
        #self.ACT_PER_LAYER = actPerLayer
        activationCodeConverter = ActivationFunctionsCodeConverter()
        self.ACT_PER_LAYER = activationCodeConverter.get_activationFunctions(actPerLayer, True)
        self.NB_PER_LAYER = nbperlayer
        

        self.METRICS = []
        for m in metrics:
            self.METRICS.append(MCC.id_to_name(m))
        
        self.LOSS = MCC.id_to_name(loss)

        self.TYPE = problem_type

        if(actOutput==None):
            if(problem_type=="CLASSIFICATION"):
                self.ACT_OUTPUT = "softmax"
            elif (problem_type=="REGRESSION"):
                self.ACT_OUTPUT = "linear"
            else :
                self.ACT_OUTPUT = 'sigmoid'
        else:
            self.ACT_OUTPUT = activationCodeConverter.get_activationFunctions(actOutput, False)

            



        self.BATCH_SIZE = batchSize
        #self.PERCENTAGE_TRAINING = percentage_training
        #ukupni procenat za trening i validaciju
        self.PERCENTAGE_TRAINING_AND_VALIDATION = percentage_training + percentage_validation

        # self.REGRESSION_LOSS = 'mean_squared_error'
        # self.CLASSIFICATION_LOSS = 'CategoricalCrossentropy'


        if FULL_MODE:
            # Dataframe
            self.datasetAll = datasetAll
            self.dataframe = self.load_dataframe() #dataframe koji se sastoji samo od ulaznih i izlaznih kolona

            #self.PERCENTAGE_VALIDATION -> procenat validacionog skupa u trening skupu     
            self.PERCENTAGE_VALIDATION = self.train_val_PercentageSplit(percentage_training, percentage_validation)

            #podela na trening i testne podatke
            self.train_dataset, self.test_dataset, self.train_labels, self.test_labels = self.train_test()
            #skaliranje podataka
            self.normed_train_dataset, self.normed_test_dataset, self.normed_train_labels, self.normed_test_labels = self.data_standardization()


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
    
    #f-ja train_val_PercentageSplit racuna koliki je procenat validacionog skupa u trening skupu, na osnovu procenta trening skupa i validacionog skupa u celokupnom skupu podataka
    def train_val_PercentageSplit(self, percentageTrain, percentageVal):
        brVrsta = self.dataframe.shape[0]
        percentageTrainVal = percentageTrain + percentageVal
        brVrstaTrainVal = brVrsta * percentageTrainVal
        brVrstaVal = brVrsta * percentageVal
        percentageVal_inTraining = brVrstaVal/brVrstaTrainVal
        return percentageVal_inTraining

    #f-ja train_test - podela podataka za treniranje i testiranje
    #outputs - lista stringova (nazivi kolona koji su output)
    def train_test(self):
        train_dataset = self.dataframe.sample(frac=self.PERCENTAGE_TRAINING_AND_VALIDATION,random_state=0) #podaci za treniranje
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
        #scaler = StandardScaler()
        scaler = MinMaxScaler()
        normed_train_data = scaler.fit_transform(self.train_dataset)
        #normed_train_data -> povratna vrednost je niz (array)
        normed_test_data = scaler.fit_transform(self.test_dataset)
        normed_train_labels = scaler.fit_transform(self.train_labels)
        normed_test_labels = scaler.fit_transform(self.test_labels)

        normed_train_df = pd.DataFrame(data = normed_train_data, 
                    index = self.train_dataset.index, 
                    columns = self.train_dataset.columns) # od niza pravi dataframe
        normed_test_df = pd.DataFrame(data = normed_test_data, 
                    index = self.test_dataset.index, 
                    columns = self.test_dataset.columns)
        normed_train_labels_df = pd.DataFrame(data = normed_train_labels, 
                    index = self.train_labels.index, 
                    columns = self.train_labels.columns)
        normed_test_labels_df = pd.DataFrame(data = normed_test_labels, 
                    index = self.test_labels.index, 
                    columns = self.test_labels.columns)

        return normed_train_df, normed_test_df, normed_train_labels_df, normed_test_labels_df


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
        # if(self.TYPE=="REGRESSION"):
        #     model.add(Dense(1, activation = self.ACT_OUTPUT))
        # elif(self.TYPE=="CLASSIFICATION"):
        #     model.add(Dense(len(self.outputs), activation=self.ACT_OUTPUT))
        model.add(Dense(len(self.outputs), activation = self.ACT_OUTPUT))

        # model_loss = self.REGRESSION_LOSS
        # if(self.TYPE=="CLASSIFICATION"):
        #     model_loss = self.CLASSIFICATION_LOSS

        model_loss = self.LOSS


        model.compile(loss = model_loss,
                optimizer = self.OPTIMIZER,
                metrics = self.METRICS)

        # print(model)
        return model



    #obucavanje modela
    def fit_model(self, model, epoch):
        print('fit method begin')
        #self.train_labels
        history = model.fit(self.normed_train_dataset, self.normed_train_labels, 
                            epochs = epoch, batch_size = self.BATCH_SIZE, 
                            validation_split = self.PERCENTAGE_VALIDATION, 
                            verbose=0, callbacks=self.CALLBACKS)

        return history.history


    def evaluate_model(self, model):
        #self.test_labels
        results = model.evaluate(self.normed_test_dataset, self.normed_test_labels, verbose = 0)

        return results


    def predict_model(self, model):
        predictions = model.predict(self.test_dataset)

        return predictions


    # --------

    def new_model(self):
        self.model = self.build_model()
        return self.model

    def load_model(self, filepath: str):
        self.model = tf.keras.models.load_model(filepath)

    def save_model(self, path: str, name: str):
        model_path = path + name
        self.model.save(model_path)
        return model_path


    def start_training(self, epoch):

        print('Training method begin')

        if self.model == None:
            print('Model is None - If')
            self.new_model()

        print('Training Started')
        # sleep(3)

        self.fit_model(self.model, epoch)

        print('TRAINING FINISHED')

        #print(self.model.metrics_names)
        nms = self.model.metrics_names
        rez = self.evaluate_model(self.model)

        # Spajanje liste naziva metrika (loss) i liste sa performansama modela u recnik
        results = {}
        if type([]) == type(rez):
            for i in range(len(rez)):
                results[nms[i]] = rez[i]
        else:
            results = {'loss': rez}

        # Izvlacenje informacije o loss-u modela
        # loss_metric = self.REGRESSION_LOSS
        # if(self.TYPE=="CLASSIFICATION"):
        #     loss_metric = self.CLASSIFICATION_LOSS
            

        return results

        
# Test

