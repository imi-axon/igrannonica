from services.statistics import StatisticsService

from services.util import read_str_to_df
from services.util import object_to_json


#def statistics_json(csvString):
#    print(csvString)

#    dataframe = read_str_to_df(csvString)
#    stat = StatisticsService(dataframe)
    
    
#    number_of_columns = dataframe.shape[1]
#    columns = dataframe.columns

#    corr_matrix = stat.correlation_matrix()

#    json = '{' #begin

#    json += '"cormat":' #begin cormat
#    json +='{' 
#    json += '"cols":'
#    #json += '['
    
#    number_columns = corr_matrix.shape[0]
#    #for i in range (0,number_columns):
#    #    column = corr_matrix.columns[i]
#    #    json += '"' + column + '"'
#    #    if (i!=number_columns-1):
#    #        json += ','
#    #json += ']'
    
#    mat_columns = corr_matrix.columns.to_list()
#    json_columns = object_to_json(mat_columns)
#    json += json_columns
    
    
#    json += ','

#    json += '"cors":'
#    json += '[' 
#    for i in range(1,number_columns):
#        for j in range(i):
#            r = corr_matrix.columns[i] 
#            c = corr_matrix.columns[j] 
#            data=corr_matrix[r][c]
#            json += str(data)
#            if (i != number_columns-1):
#                json += ','
#            if(i == number_columns-1 and j!=i-1):
#                json += ','
#    json += ']'
    
#    json += '}' #end cormat

#    json += ','
#    json += '"colstats":' #begin colstats
#    json += '['
#    col_min = stat.stat_min()
#    col_max = stat.stat_max()
#    col_avg = stat.stat_mean()
#    col_med = stat.stat_median()
#    col_null = stat.stat_null()

#    for i in range(0,number_of_columns):
#        json += '{'
#        json += '"col":'
#        json += '"' + columns[i] + '"'
#        json += ','
#        json += '"min":'
#        json += str(col_min[i])
#        json += ','
#        json += '"max":'
#        json += str(col_max[i])
#        json += ','
#        json += '"avg":'
#        json += str(col_avg[i])
#        json += ','
#        json += '"med":'
#        json += str(col_med[i])
#        json += ','
#        json += '"nul":'
#        json += str(col_null[i])
#        json += '}'
#        if(i!=number_of_columns-1):
#            json+=','
    
#    json += ']' #end colstats

#    json += ','
    
#    json += '"rownulls":'
#    row_null = stat.stat_row_null().to_list()
#    json_row_null = object_to_json(row_null)
    
#    json += json_row_null

#    json += '}' #end

#    json = json.replace('nan', '"nan"')

#    print(json)

#    return json



import json
import numpy as np
from .util import dictionary
from .util import NpEncoder
import pandas as pd

class StatisticsMiddleware:

    def __init__(self,df):

        self.dataframe = df
        self.stat = StatisticsService(self.dataframe)        
        self.dictionary = dictionary()

    def add_cormat(self):
        cormat_dict = dictionary()
        
        cors = []
        
        corr_matrix = self.stat.correlation_matrix()
        columns = corr_matrix.columns.to_list()
        number_columns = corr_matrix.shape[0]
        for i in range(1,number_columns):
            for j in range(i):
                r = corr_matrix.columns[i] 
                c = corr_matrix.columns[j] 
                data=corr_matrix[r][c]
                if(pd.isna(data)):
                    data=None
                cors.append(data)

        cormat_dict.add('cols',columns)
        cormat_dict.add('cors',cors)
        return cormat_dict

    def add_colstats(self):
        lista = []
        #number_of_columns = self.dataframe.shape[1]
        #columns = self.dataframe.columns
        #col_min = self.stat.stat_min()
        #col_max = self.stat.stat_max()
        #col_avg = self.stat.stat_mean()
        #col_med = self.stat.stat_median()
        #col_null = self.stat.stat_null()

        #for i in range(0,number_of_columns):
        #    dict_col = dictionary()
        #    dict_col.add("col", columns[i])
        #    dict_col.add("min", col_min[i])
        #    dict_col.add("max", col_max[i])
        #    dict_col.add("avg", col_avg[i])
        #    dict_col.add("med", col_med[i])
        #    dict_col.add("nul", col_null[i])
        #    lista.append(dict_col)
        
        numeric_columns = self.dataframe.select_dtypes(exclude=['object']).columns.tolist()
        for column in numeric_columns:
            dict_col = dictionary()

            min = self.stat.stat_min(column)
            max = self.stat.stat_max(column)
            mean = self.stat.stat_mean(column)
            med = self.stat.stat_median(column)
            if(pd.isna(min)):
                min = None
            if(pd.isna(max)):
                max = None
            if(pd.isna(mean)):
                mean = None
            if(pd.isna(med)):
                med = None
            dict_col.add("col", column)
            dict_col.add("min", min)
            dict_col.add("max", max)
            dict_col.add("avg", mean)
            dict_col.add("med", med)
            lista.append(dict_col)    
        
        return lista

    def add_rownulls(self):
        return self.stat.stat_row_null().to_list()

    def add_colnulls(self):
        columns = self.dataframe.columns.to_list()
        col_null = self.stat.stat_null().to_list()
        
        collnulls_dict = dictionary()
        collnulls_dict.add("cols", columns)
        collnulls_dict.add("nulls", col_null)
        return collnulls_dict

    def add_categorical_stats(self):
        lista = []
        categorical_columns = self.dataframe.select_dtypes(include=['object']).columns.tolist()
        
        if(len(categorical_columns)>0):
            stat_cat = self.stat.stat_categorical_columns()
        
            for column in categorical_columns:
                dict_col = dictionary()
                dict_col.add("col", column)
                dict_col.add("count", stat_cat[column]['count'])
                dict_col.add("unique", stat_cat[column]['unique'])
                dict_col.add("top", stat_cat[column]['top'])
                dict_col.add("freq", stat_cat[column]['count'])
                lista.append(dict_col)    
        
        return lista
        

    def get_stat(self):
        self.dictionary.add("cormat",self.add_cormat())
        self.dictionary.add("colstats", self.add_colstats())
        self.dictionary.add("rownulls", self.add_rownulls())
        self.dictionary.add("colnulls", self.add_colnulls())
        self.dictionary.add("categorical_colstats", self.add_categorical_stats())

        json_object = self.stat_to_json()

        return json_object, self.dictionary


    def stat_to_json(self):
        return self.to_json(self.dictionary)

    def to_json(self, obj):
        #return json.dumps(obj, cls=NpEncoder).replace('NaN','"nan"')
        return json.dumps(obj, cls=NpEncoder)

#sm = StatisticsMiddleware(csvString)
#json_obj = sm.statistics_json()


#PROBA

# string = """Tezina;Visina;Godine
#         60;;20
#         70;185;30
#         55;162;25"""

# s = statistics_json(string)
# s

# y = json.dumps(s, ensure_ascii = False, indent=4)
# print(s)
# print(json.JSONDecoder().decode(s))

#cuva se 'data.json'
# with open('data.json', 'w', encoding='utf-8') as f:
#     json.dump(s, f, ensure_ascii=False, indent=4)
