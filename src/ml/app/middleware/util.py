import json
import numpy as np

class dictionary(dict):
    def __init__(self):
        self = dict()
    
    def add(self, key, value):
        self[key] = value



#dodato zbog: TypeError: Object of type int64 is not JSON serializable
class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)