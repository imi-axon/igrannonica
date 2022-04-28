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



class NNModelMiddleware():

    def __init__(self):
        pass

    def new_default_model(self, inputs, outputs, 
        actPerLayer = ['relu']*2,
        nbperlayer = [3]*2, 
        learning_rate = 0.1, 
        metrics = ['mse']
    ):
        # setup
        problem_type = 'C' if len(outputs) > 1 else 'R'
        actOut = 'softmax' if problem_type == 'C' else 'linear'
        model_loss = 'categorical_crossentropy' if problem_type == 'C' else 'mse'
        regularization = None
        
        model = Sequential()

        # hidden layers
        model.add(Dense(nbperlayer[0], input_shape=[len(inputs)], activation = actPerLayer[0]))
        for i in range(1, len(nbperlayer)):
            model.add(Dense(nbperlayer[i], activation=actPerLayer[i]))
            
        # output layer
        model.add(Dense(len(outputs), activation = actOut))

        # create model
        model.compile(loss = model_loss,
                optimizer = keras.optimizers.Adam(learning_rate = learning_rate),
                metrics = metrics)

        self.model = model
        return {
            'inputs': inputs,
            'outputs': outputs,
            'neuronsPerLayer': nbperlayer,
            'actPerLayer': actPerLayer,
            'actOut': actOut,
            'learningRate': learning_rate,
            'reg': '',
            'regRate': 0,
            'batchSize': 10,
            'problemType': 'regression' if problem_type == 'R' else 'classification',
            'splitType': 'random',
            'trainSplit': 0.7,
            'valSplit': 0.15
        }

    
    def load_model(self, path = './', name = None):
        model_path = path + name + '.h5'
        self.model = tf.keras.models.load_model(model_path)


    def save_model(self, path: str, name: str):
        model_path = path + name
        self.model.save(model_path)
        return model_path