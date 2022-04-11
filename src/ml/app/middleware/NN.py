import tensorflow as tf
from tensorflow import keras
import numpy as np
import pandas as pd
import json

from util import dictionary
from util import NpEncoder

class NN_Middleware():

    def __init__(self, h5Link):
        self.model = tf.keras.models.load_model(h5Link)

    def NN_json(self):
        number_layers = len(self.model.layers) #broj slojeva

        # WEIGHTS
        list_weights = []
        for i in range(number_layers):
          list_layer_weights = []
          weights = self.model.layers[i].get_weights()[0] #tezine u i-tom sloju
          nn = len(weights[0]) #broj neurona u i-tom sloju
          for i in range(nn):
            neuron_weights = []
            for j in range(len(weights)):
              neuron_weights.append(weights[j][i])
            list_layer_weights.append(neuron_weights)
          list_weights.append(list_layer_weights)
        #print(list_weights) #list_weights[i] -> i-ti sloj; list_weights[i][j] -> j-ti neuron u i-tom sloju
        
        #BIAS
        list_bias = []
        for i in range(number_layers):
          bias = self.model.layers[i].get_weights()[1] #lista bias-a u i-tom sloju
          list_bias.append(bias)

        NN_dict = dictionary()
        layer_list = []
        for i in range(number_layers): # len(number_layers) - broj slojeva
          layer_dict = dictionary()
          neuron_list = []
          for j in range(len(list_weights[i])): #len(list_weights[i]) - broj neurona u i-tom sloju
            neuron_dict = dictionary()
            neuron_dict.add("weights", list_weights[i][j])
            neuron_dict.add("bias", list_bias[i][j])
            neuron_list.append(neuron_dict)
          layer_dict.add("neurons", neuron_list)
          layer_list.append(layer_dict)
        NN_dict.add("layers",layer_list)

        json_object = json.dumps(NN_dict, cls=NpEncoder)

        return json_object
