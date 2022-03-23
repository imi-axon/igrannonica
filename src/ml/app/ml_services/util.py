import pandas as pd
import sys
if sys.version_info[0]<3:
    from StringIO import StringIO
else:
    from io import StringIO

# f-ja read_str_to_df prosledjeni csv string konvertuje u DataFrame
def csv_to_df(x, sep):
    TESTDATA = StringIO(x)
    df = pd.read_csv(TESTDATA, sep=sep)
    return df




