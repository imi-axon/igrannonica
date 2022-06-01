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




#ako je povratna vrednost True -> konfiguracije su iste; ucitati postojeci model
#ako je povratna vrednost False -> konfiguracije se razlikuju; praviti novi model
def compareConfigurations(conf_a, conf_b) :
    
    try:
        if len(conf_a.keys()) != len(conf_a.keys()):
            return False

        # Automatska provera atributa (trenutno podrzava samo liste i prote tipove)
        
        for k in conf_a.keys():
            # ukoliko konfiguracije ne sadrse iste atribute
            if list(conf_b.keys()).count(k) == 0:
                return False
            
            ca = conf_a[k]
            cb = conf_b[k]

            # ukoliko je atribut lista
            if isinstance(ca, list):
                for i in range(ca):
                    if(ca[i] != cb[i]):
                        return False

            # ukoliko je atribut prost tip
            elif ca != cb:
                return False

        return True
        
    except:
        return False

