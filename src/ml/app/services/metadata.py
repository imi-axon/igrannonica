
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
            kolonaDict = {"type": "num", "trainReady" : False, "encoding" : "null"}
            metadata["columns"].update({column : kolonaDict})

        for column in categorical_columns:
            kolonaDict = {"type" : "cat", "trainReady" : False, "encoding" : "null"}
            metadata["columns"].update({column : kolonaDict})

        return metadata

    
    def updateTrainReady(self, metadata, dataframe, stats):

        numeric_columns = dataframe.select_dtypes(exclude=['object']).columns.tolist()
        for column in numeric_columns:
            num_nulls = dataframe[column].isna().sum()
            if(num_nulls == 0):
                if(metadata['columns'][column]['type']=='num'):
                    metadata['columns'][column]['trainReady'] = True
        #nema provere za kategorijske -> po default-u : False;  Pri enkodiranju se postavlja na True (tada sigurno nemaju null vrednosti i enkodirane su)
        metadata.update({"statistics" : stats})
        return metadata

