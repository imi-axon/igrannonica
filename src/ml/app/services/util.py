import pandas as pd
import sys
if sys.version_info[0]<3:
    from StringIO import StringIO
else:
    from io import StringIO

import json

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