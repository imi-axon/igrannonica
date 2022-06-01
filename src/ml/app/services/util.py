import pandas as pd
import sys
if sys.version_info[0]<3:
    from StringIO import StringIO
else:
    from io import StringIO

import json

import tensorflow as tf
from tensorflow import keras

from keras.metrics import serialize as m_srz
from keras.metrics import get as m_get

# f-ja read_str_to_df prosledjeni string konvertuje u DataFrame
def read_str_to_df(x,separator,quoteChar):
    TESTDATA = StringIO(x)
    df = pd.read_csv(TESTDATA, sep=separator, quotechar=quoteChar)
    return df


# Konvertuje objekat/listu u JSON string
def object_to_json(obj):

    return json.JSONEncoder().encode(obj)

def is_function(x) -> bool:
    def fn():
        pass
    return type(fn) == type(x)


class MetricsCodesConverter():

    def __init__(self):
        self.metrics = [
            # Regression
            'MeanSquaredError',
            'MeanAbsoluteError',
            'RootMeanSquaredError',
            'MeanAbsolutePercentageError',
            'MeanSquaredLogarithmicError',
            'CosineSimilarity',
            'Poisson',

            # Classification
            'TruePositives',
            'TrueNegatives',
            'FalsePositives',
            'FalseNegatives',
            'AUC',
            'Recall',
            'Precision',

            # Classification (Binary)
            'BinaryCrossentropy',
            'Hinge',
            'SquaredHinge',

            # Classification (Multiclass)
            'CategoricalCrossentropy',
            'SparseCategoricalCrossentropy',
            'kullback_leibler_divergence',
        ]

        self.mappings = {}
        for m in self.metrics:
            self.mappings[self.conv(m)] = m


    def conv(self, x):
        # print(x)
        metric = m_get(x)
        identifier = ''
        if (is_function(metric)):
            identifier = m_srz(metric)
        else:
            identifier = m_srz(metric)['config']['name']
        return identifier
        

    def id_to_name(self, identifier: str) -> str:
        return self.mappings[identifier]


MCC = MetricsCodesConverter()

# TEST
# for key in MCC.mappings:
#     print(MCC.id_to_name(key))



class ActivationFunctionsCodeConverter():
    

    def get_activationFunction(self,code):
        if(code=='lin'):
            return keras.activations.serialize(keras.activations.linear)
        elif(code=='elu'):
            return keras.activations.serialize(keras.activations.elu)
        elif(code=='relu'):
            return keras.activations.serialize(keras.activations.relu)
        elif(code=='gelu'):
            return keras.activations.serialize(keras.activations.gelu)
        elif(code=='selu'):
            return keras.activations.serialize(keras.activations.selu)
        elif(code=='exp'):
            return keras.activations.serialize(keras.activations.exponential)
        elif(code=='sig'):
            return keras.activations.serialize(keras.activations.sigmoid)
        elif(code=='hsig'):
            return keras.activations.serialize(keras.activations.hard_sigmoid)
        elif(code=='smax'):
            return keras.activations.serialize(keras.activations.softmax)
        elif(code=='splus'):
            return keras.activations.serialize(keras.activations.softplus)
        elif(code=='ssign'):
            return keras.activations.serialize(keras.activations.softsign)
        elif(code=='swish'):
            return keras.activations.serialize(keras.activations.swish)
        elif(code=='tanh'):
            return keras.activations.serialize(keras.activations.linear)
        else:
            return keras.activations.serialize(keras.activations.relu)

    #actFunc - lista aktivacionih funkcija (za svaki sloj)/ jedna aktivaciona funkcija
    #isList - flag (da li je actFunc lista ili jedna vrednost)
    def get_activationFunctions(self, actFunc, isList=True):
        if(isList==True):
            act_fun = []
            for act in actFunc :
                af = self.get_activationFunction(act)
                act_fun.append(af)
            return act_fun
        else :
            return self.get_activationFunction(actFunc)
        return None

