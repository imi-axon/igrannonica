import pathlib
#from sqlite3 import DatabaseError
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
import tensorflow as tf
from tensorflow import keras
#from tensorflow.keras import layers

#print(tf.__version__)


class Statistika:

    # klasa Statistika kao argument u konstruktoru ima DataFrame (ucitani csv - skup podataka)
    def __init__(self,df):
        self.dataset = df

    #f-ja correlation_matrix - za izracunavanje korelacione matrice
    #povratna vrednost je DataFrame
    def correlation_matrix(self):
        return self.dataset.corr()

    #f-ja statistics za izracunavanje statistickih podataka (za svaku kolonu - broj podataka, srednju vrednost, standardnu devijaciju, min, 25%, 50%(medijana), 75% i max)
    #povratna vrednost je DataFrame
    def statistics(self):
        return self.dataset.describe().transpose()

    #f-ja stat_mean za svaku kolonu racuna mean - srednju vrednost
    #povratna vrednost je Series ('pandas.core.series.Series')
    def stat_mean(self):
        return self.dataset.mean()
    
    #f-ja stat_median za svaku kolonu racuna medijanu
    #povratna vrednost je Series
    def stat_median(self):
        return self.dataset.median()

    #f-ja stat_min za svaku kolonu racuna minimum
    #povratna vrednost je Series
    def stat_min(self):
        return self.dataset.min()
    
    #f-ja stat_max za svaku kolonu racuna maksimum
    #povratna vrednost je Series
    def stat_max(self):
        return self.dataset.max()


    






#proba
#ucitavanje podataka
#dataset_path = keras.utils.get_file("auto-mpg.data", "http://archive.ics.uci.edu/ml/machine-learning-databases/auto-mpg/auto-mpg.data")
#column_names = ['MPG','Cylinders','Displacement','Horsepower','Weight','Acceleration', 'Model Year', 'Origin']
#raw_dataset = pd.read_csv(dataset_path, names=column_names, na_values = "?", comment='\t', sep=" ", skipinitialspace=True)
#dataset = raw_dataset.copy()
#dataset.tail()

#stat = Statistika(dataset)
#kor = stat.correlation_matrix()
#kor
#kor.info()

#statistic = stat.statistics()
#statistic.info()

#m = stat.stat_mean()
#print(m)

#md = stat.stat_median()
#md
#print(type(md))

