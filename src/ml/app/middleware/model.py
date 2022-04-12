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
        actOut = 'linear',
        nbperlayer = [3]*2, 
        learning_rate = 0.1, 
        metrics = ['mse'], 
        regularization_rate = 0.1, 
        regularization = '', 
    ):
        # setup
        regularization = regularizers.L1(regularization_rate) if regularization == 'L1' else (regularizers.L2(regularization_rate) if regularization == 'L1' else None)
        problem_type = 'C' if len(outputs) > 1 else 'R'
        model_loss = 'categorical_crossentropy' if problem_type == 'C' else 'mse'
        
        model = Sequential()

        # input layer
        model.add(Dense(nbperlayer[0], kernel_regularizer = regularization, input_shape=[len(inputs)], activation = actOut))
        
        # hidden layers
        for i in range(1, len(nbperlayer)-1):
            model.add(Dense(nbperlayer[i], kernel_regularizer = regularization, activation=actPerLayer[i]))
            
        # output layer
        model.add(Dense(len(outputs), activation = actPerLayer[-1]))
        # model.add(Dense(len(outputs), activation= 'softmax' if problem_type == 'C' else None))

        # create model
        model.compile(loss = model_loss,
                optimizer = keras.optimizers.Adam(learning_rate = learning_rate),
                metrics = metrics)

        self.model = model

    
    def load_model(self, path = './', name = None):
        model_path = path + name + '.h5'
        self.model = tf.keras.models.load_model(model_path)


    def save_model(self, path: str, name: str):
        model_path = path + name
        self.model.save(model_path)
        return model_path