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



# ==== Statistics ====

class StatisticsService:

    # klasa Statistika kao argument u konstruktoru ima ucitani dataframe
    def __init__(self, df):
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
    #povratna vrednost je float
    def stat_mean(self,column):
        return self.dataset[column].mean()
    
    #f-ja stat_median za svaku kolonu racuna medijanu
    #povratna vrednost je float
    def stat_median(self,column):
        return self.dataset[column].median()

    #f-ja stat_min za svaku kolonu racuna minimum
    #povratna vrednost je float
    def stat_min(self,column):
        return self.dataset[column].min()
    
    #f-ja stat_max za svaku kolonu racuna maksimum
    #povratna vrednost je float
    def stat_max(self,column):
        return self.dataset[column].max()

    #f-ja stat_null za svaku kolonu racuna broj null vrednosti
    #povratna vrednost je Series
    def stat_null(self):
        return self.dataset.isnull().sum()

    #f-ja stat_row_null racuna broj null vrednosti za svaku vrstu
    #povratna vrednost je Series
    def stat_row_null(self):
        return self.dataset.isna().transpose().sum()

    #f-ja stat_categorical_columns vraca statistiku za kategorijske podatke
    # povratna vrednost je DataFrame
    def stat_categorical_columns(self):
        categorical_columns = self.dataset.select_dtypes(include=['object']).columns.tolist()
        df_categorical_columns = self.dataset[categorical_columns]
        stat_categorical = df_categorical_columns.describe()
        return stat_categorical






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

#x = """Tezina; Visina; Godine
#    67;167;20
#    79;180;35"""



#dat = read_str_to_df(x)
#dat.head()

#dat.shape

#stat1 = Statistics(x)

#stat1.correlation_matrix()
#stat1.stat_mean()
#stat1.statistics()