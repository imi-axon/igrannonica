import json

from .ml import Statistics

from .util import read_str_to_df
from .util import object_to_json


def statistics_json(csvString):
    dataframe = read_str_to_df(csvString)
    stat = Statistics(dataframe)
    
    
    number_of_columns = dataframe.shape[1]
    columns = dataframe.columns

    corr_matrix = stat.correlation_matrix()

    json = '{' #begin

    json += '"cormat":' #begin cormat
    json +='{' 
    json += '"cols":'
    #json += '['
    
    number_columns = corr_matrix.shape[0]
    #for i in range (0,number_columns):
    #    column = corr_matrix.columns[i]
    #    json += '"' + column + '"'
    #    if (i!=number_columns-1):
    #        json += ','
    #json += ']'
    
    mat_columns = corr_matrix.columns.to_list()
    json_columns = object_to_json(mat_columns)
    json += json_columns
    
    
    json += ','

    json += '"cors":'
    json += '[' 
    for i in range(1,number_columns):
        for j in range(i):
            r = corr_matrix.columns[i] 
            c = corr_matrix.columns[j] 
            data=corr_matrix[r][c]
            json += str(data)
            if (i != number_columns-1):
                json += ','
            if(i == number_columns-1 and j!=i-1):
                json += ','
    json += ']'
    
    json += '}' #end cormat

    json += ','
    json += '"colstats":' #begin colstats
    json += '['
    col_min = stat.stat_min()
    col_max = stat.stat_max()
    col_avg = stat.stat_mean()
    col_med = stat.stat_median()
    col_null = stat.stat_null()

    for i in range(0,number_of_columns):
        json += '{'
        json += '"col":'
        json += '"' + columns[i] + '"'
        json += ','
        json += '"min":'
        json += str(col_min[i])
        json += ','
        json += '"max":'
        json += str(col_max[i])
        json += ','
        json += '"avg":'
        json += str(col_avg[i])
        json += ','
        json += '"med":'
        json += str(col_med[i])
        json += ','
        json += '"nul":'
        json += str(col_null[i])
        json += '}'
        if(i!=number_of_columns-1):
            json+=','
    
    json += ']' #end colstats

    json += ','
    
    json += '"rownulls":'
    row_null = stat.stat_row_null().to_list()
    json_row_null = object_to_json(row_null)
    
    json += json_row_null

    json += '}' #end
    return json



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
