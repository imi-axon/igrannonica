import pathlib
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras


from sklearn.preprocessing import LabelEncoder
from .util import read_str_to_df

class DataEditorService:

    # klasa DataEditorService kao argument u konstruktoru ima DataFrame (ucitani csv - skup podataka)
    def __init__(self, dataframe):
        self.dataset = read_str_to_df(dataframe)

    #delete_columns : brise kolone iz dataset-a
    #columns : lista stringova (naziva kolona) koje treba obrisati
    def delete_columns(self, columns):
        for column in columns:
            self.dataset.drop(column, axis='columns', inplace=True)
    
    #delete_rows : brise redove iz dataset-a koji za prosledjene kolone imaju null vrednosti
    #columns : lista stringova (naziva kolona)
    def delete_rows(self, columns):
        self.dataset.dropna(subset=columns, inplace=True)

    #find_categorical_columns : iz dataset-a pronalazi kategorijske kolone
    #povratna vrednost je lista stringova (naziva kolona)
    def find_categorical_columns(self):
        categorical_columns = self.dataset.select_dtypes(include=['object']).columns.tolist()
        return categorical_columns
    
    #find_numeric_columns : iz dataset-a pronalazi numericke kolone (diskretni i kontinualni podaci)
    #povratna vrednost je lista stringova (naziva kolona)
    def find_numeric_columns(self):
        numeric_columns = self.dataset.select_dtypes(exclude=['object']).columns.tolist()
        return numeric_columns

    # popunjavanje null vrednosti numerickih kolona
    #fill_na_mean : null vrednosti iz prosledjenih kolona popunjava srednjom vrednoscu tih kolona (pre toga vrsi proveru da li je ta kolona numericka)
    def fill_na_mean(self, columns):
        numeric_columns = self.find_numeric_columns()
        for column in columns:
            if column in numeric_columns:
                column_mean = self.dataset[column].mean()
                self.dataset[column].fillna(column_mean,inplace=True)

    # popunjavanje null vrednosti numerickih kolona
    #fill_na_median : null vrednosti iz prosledjenih kolona popunjava medijanom (pre toga vrsi proveru da li je ta kolona numericka)
    def fill_na_median(self, columns):
        numeric_columns = self.find_numeric_columns()
        for column in columns:
            if column in numeric_columns:
                column_median = self.dataset[column].median()
                self.dataset[column].fillna(column_median,inplace=True)
    
    # popunjavanje null vrednosti kategorijskih kolona
    #fill_na_categorical : null vrednosti iz prosledjenih kolona popunjava vrednoscu koja se najcesce pojavljuje u toj koloni
    def fill_na_categorical(self,columns):
        categorical_columns = self.find_categorical_columns()
        for column in columns:
            if column in categorical_columns:
                data = self.dataset[column].mode()[0]
                self.dataset[column].fillna(data, inplace=True)

    #delete_duplicates : uklanja duplikate
    def delete_duplicates(self):
        self.dataset.drop_duplicates(inplace=True)

    #enkodiranje kategorijskih kolona
    #label_encoding : vrsi enkodiranje prosledjenih kolona pomocu label encoding-a
    def label_encoding(self,columns):
        lb_enc = LabelEncoder()
        del_columns = []
        cat = self.find_categorical_columns()
        for column in columns:
            if column in cat:
                self.dataset[column + '_code'] = lb_enc.fit_transform(self.dataset[column])
                del_columns.append(column)
        self.delete_columns(del_columns)

    #enkodiranje kategorijskih kolona
    #one_hot_encoding : vrsi enkodiranje prosledjenih kolona pomocu one-hot encoding-a
    #povratna vrednost je DataFrame
    def one_hot_encoding(self,columns):
        cat = self.find_categorical_columns()
        for column in columns:
            if column in cat:
                self.dataset = pd.get_dummies(self.dataset, columns=[column], prefix = [column])
        return self.dataset





