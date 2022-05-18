
class MetadataService :

    def generate(self, dataframe):
        metadata = {}
        columns = {}
        metadata.update({"columns": columns})
        metadata.update({"statistics": "None"})

        columns = dataframe.columns.to_list()
        numeric_columns = dataframe.select_dtypes(exclude=['object']).columns.tolist()
        categorical_columns = dataframe.select_dtypes(include=['object']).columns.tolist()
        
        for column in numeric_columns:
            num_nulls = dataframe[column].isna().sum()
            if(num_nulls==0):
                kolonaDict = {"type": "num", "trainReady" : True, "encoding" : None}
            else:
                kolonaDict = {"type": "num", "trainReady" : False, "encoding" : None}
            metadata["columns"].update({column : kolonaDict})

        for column in categorical_columns:
            kolonaDict = {"type" : "cat", "trainReady" : False, "encoding" : None}
            metadata["columns"].update({column : kolonaDict})

        return metadata

    
    def updateTrainReady(self, metadata, stats):
        columns = list(metadata['columns'])
        for column in columns:
            if(metadata['columns'][column]['type']=='num'):
                for i in range(len(stats["colnulls"]['cols'])):
                    if(column == stats["colnulls"]['cols'][i]):
                        if(stats["colnulls"]["nulls"][i]==0):
                            metadata['columns'][column]['trainReady'] = True
        #nema provere za kategorijske -> po default-u : False;  Pri enkodiranju se postavlja na True (tada sigurno nemaju null vrednosti i enkodirane su)
        metadata.update({"statistics" : stats})
        return metadata

