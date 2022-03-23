import pandas as pd
import sys
if sys.version_info[0]<3:
    from StringIO import StringIO
else:
    from io import StringIO

import json

# f-ja read_str_to_df prosledjeni string konvertuje u DataFrame
def read_str_to_df(x):
    TESTDATA = StringIO(x)
    df = pd.read_csv(TESTDATA, sep=sep)
    return df


# Konvertuje objekat/listu u JSON string
def object_to_json(obj):

    return json.JSONEncoder().encode(obj)



