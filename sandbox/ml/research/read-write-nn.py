import pathlib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

print(tf.__version__)


from util import read_str_to_df

#f-ja load_dataframe od celokupnog csv-a fajla pravi dataframe koji se sastoji od kolona koje su potrebne za kreiranje neuronske mreze
#inputs - lista stringova (nazivi kolona koji su input)
#outputs - lista stringova (nazivi kolona koji su output)
def load_dataframe(csvString, inputs, outputs):
    datasetAll = read_str_to_df(csvString)
    dataframe = pd.DataFrame()
    for column in inputs:
        dataframe[column] = datasetAll[column]
    for column in outputs:
        dataframe[column] = datasetAll[column]

    return dataframe

#f-ja train_test - podela podataka za treniranje i testiranje
#outputs - lista stringova (nazivi kolona koji su output) - podrazumevam da je jedna kolona; vise kolona - ?
def train_test(dataset, outputs):
    train_dataset = dataset.sample(frac=0.8,random_state=0) #80% podataka za treniranje
    test_dataset = dataset.drop(train_dataset.index) #ostalih 20% podataka za tesiranje
    train_labels = train_dataset.pop(outputs[0]) #izdvajanje ciljne promenljive
    test_labels = test_dataset.pop(outputs[0])
    return train_dataset, test_dataset, train_labels, test_labels


#standardizacija podataka


#proba
dataset_path = keras.utils.get_file("auto-mpg.data", "http://archive.ics.uci.edu/ml/machine-learning-databases/auto-mpg/auto-mpg.data")
dataset_path

column_names = ['MPG','Cylinders','Displacement','Horsepower','Weight',
                'Acceleration', 'Model Year', 'Origin']
raw_dataset = pd.read_csv(dataset_path, names=column_names,
                      na_values = "?", comment='\t',
                      sep=" ", skipinitialspace=True)
dataset = raw_dataset.copy()
dataset.tail()

dataset.head()

dataset["MPG"]

# prvi red
row0 = dataset.iloc[0]
row0
#prva kolona
column0 = dataset.iloc[:,0]
column0


indexes_of_input_columns = [1,2,3]
input_df = dataset.iloc[:,indexes_of_input_columns]
input_df
dataset.columns

string = """
MPG;Cylinders;Displacement;Horsepower;Weight;Acceleration;Model;Year;Origin
18.0 ;         8       ;  307.0 ;      130.0 ; 3504.0;          12.0;          70;       1
15.0;          8      ;   350.0  ;     165.0 ; 3693.0;          11.5;          70;       1
18.0 ;         8     ;    318.0   ;    150.0 ; 3436.0;          11.0;          70;       1
16.0  ;        8    ;     304.0    ;   150.0 ; 3433.0;          12.0;          70;       1
17.0   ;       8       ;  302.0     ;  140.0 ; 3449.0;          10.5;          70;       1
15.0    ;      8      ;   429.0;       198.0 ; 4341.0;          10.0;          70;       1
14.0    ;      8     ;    454.0 ;      220.0 ; 4354.0;           9.0;          70;       1
14.0    ;      8    ;     440.0  ;     215.0 ; 4312.0;           8.5;          70;       1
14.0    ;      8   ;      455.0   ;    225.0 ; 4425.0;          10.0;          70;       1
15.0    ;      8  ;       390.0    ;   190.0 ; 3850.0;           8.5;          70;       1
15.0    ;      8 ;        383.0    ;   170.0 ; 3563.0;          10.0;          70;       1
14.0    ;      8;         340.0    ;   160.0 ; 3609.0;           8.0;          70;       1"""

inputs1 = ["Cylinders", "Displacement", "Horsepower"]
outputs1 = ["MPG"]
dataf = load_dataframe(string,inputs1, outputs1)
dataf.head()
dataf.shape

datasets = train_test(dataf, outputs1)
train_dataset = datasets[0]
test_dataset = datasets[1]
train_dataset.shape
test_dataset.shape
train_labels = datasets[2]
test_labels = datasets[3]
train_labels.shape
test_labels.shape
train_labels.head()
test_labels.head()

