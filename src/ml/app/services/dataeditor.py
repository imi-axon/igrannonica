import pathlib
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras


from sklearn.preprocessing import LabelEncoder
from .util import read_str_to_df

class DataEditorService:

    #metadataDict -> recnik -> <class 'dict'>
    def __init__(self, df, sep, quoteChar, metadataDict):
        self.dataset = df
        self.metadataDict = metadataDict
        self.sep = sep
        self.quoteChar = quoteChar

    #delete_columns : brise kolone iz dataset-a
    #columns : lista stringova (naziva kolona) koje treba obrisati
    def delete_columns(self, columns):
        for column in columns:
            self.dataset.drop(column, axis='columns', inplace=True)
            del self.metadataDict["fajl"]["columns"][column]
    
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

                le_name_mapping = dict(zip(lb_enc.classes_, lb_enc.transform(lb_enc.classes_)))
                valueMappings = []
                original_list = list(le_name_mapping)
                for i in range(len(original_list)):
                    pom = {"original" : original_list[i], "new" : le_name_mapping[original_list[i]]}
                    valueMappings.append(pom)
                
                dict_valueMappings = {"valueMappings" : valueMappings}
                dict_encoding = {"type" : "label", "onehot" : "None", "label" : dict_valueMappings}
                dict_column = {"type" : "enc", "trainReady" : True, "encoding" : dict_encoding}
                new_column = column + '_code'
                self.metadataDict["fajl"]["columns"].update({new_column : dict_column})
        self.delete_columns(del_columns)

    #enkodiranje kategorijskih kolona
    #one_hot_encoding : vrsi enkodiranje prosledjenih kolona pomocu one-hot encoding-a
    #povratna vrednost je DataFrame
    def one_hot_encoding(self,columns):
        cat = self.find_categorical_columns()
        for column in columns:
            if column in cat:
                pom = self.dataset[column]
                self.dataset = pd.get_dummies(self.dataset, columns=[column], prefix = [column])
        
                dummy_variables=pd.get_dummies(pom).rename(columns=lambda x: column + "_" +str(x))
                nove_kolone = dummy_variables.columns.to_list()
                old_column = column
                catValues = []
                split = old_column + "_"
                for i in range(len(nove_kolone)):
                    x = nove_kolone[i].split(split)
                    catValues.append(x[1])
                
                for i in range(len(nove_kolone)):    
                    dict_oneHot = {"originalHeader" : column, "catValue" : catValues[i]}
                    dict_encoding = {"type" : "onehot", "onehot" : dict_oneHot, "label" : "None"}
                    dict_column = {"type" : "enc", "trainReady" : True, "encoding" : dict_encoding}
                    new_column = nove_kolone[i]
                    self.metadataDict["fajl"]["columns"].update({new_column : dict_column})

                del self.metadataDict["fajl"]["columns"][column]

        
        return self.dataset

    def csv_result(self, sep: str = ';'):
        return self.dataset.to_csv(sep=self.sep, quotechar= self.quoteChar, index=False)

    def get_metadataDict(self):
        return self.metadataDict





