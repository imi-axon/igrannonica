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
def compareConfigurations(conf1Json, conf2Json) :
    inputs1 = conf1Json['inputs']                            
    outputs1 = conf1Json['outputs']                           
    neuronsPerLayer1 = conf1Json['neuronsPerLayer']          
    actPerLayer1 = conf1Json['actPerLayer']                  
    actOut1 = conf1Json['actOut']                           
    learningRate1 = conf1Json['learningRate']                
    regularization1 = conf1Json['reg']                      
    regularizationRate1 = conf1Json['regRate']               
    batchSize1 = conf1Json['batchSize']                        
    problemType1 = conf1Json['problemType']
    splitType1 = conf1Json['splitType']         
    trainSplit1 = conf1Json['trainSplit']                    
    valSplit1 = conf1Json['valSplit']
        
    inputs2 = conf2Json['inputs']                       
    outputs2 = conf2Json['outputs']                       
    neuronsPerLayer2 = conf2Json['neuronsPerLayer']          
    actPerLayer2 = conf2Json['actPerLayer']                  
    actOut2 = conf2Json['actOut']                           
    learningRate2 = conf2Json['learningRate']                
    regularization2 = conf2Json['reg']                      
    regularizationRate2 = conf2Json['regRate']               
    batchSize2 = conf2Json['batchSize']                        
    problemType2 = conf2Json['problemType']
    splitType2 = conf2Json['splitType']       
    trainSplit2 = conf2Json['trainSplit']                    
    valSplit2 = conf2Json['valSplit']                        
    
    if(actOut1 != actOut2):
        return False
    if(regularization1 != regularization2):
        return False
    if(regularizationRate1 != regularizationRate2):
        return False
    if(learningRate1 != learningRate2):
        return False
    if(batchSize1 != batchSize2):
        return False
    if(problemType1 != problemType2):
        return False
    if(splitType1 != splitType2):
        return False
    if(trainSplit1 != trainSplit2):
        return False
    if(valSplit1 != valSplit2):
        return False

    len_inputs1 = len(inputs1)
    len_inputs2 = len(inputs2)
    if(len_inputs1 != len_inputs2):
        return False
    else:
        for i in range(len_inputs1):
            if(inputs1[i] != inputs2[i]):
                return False
    
    len_outputs1 = len(outputs1)
    len_outputs2 = len(outputs2)
    if(len_outputs1 != len_outputs2):
        return False
    else:
        for i in range(len_outputs1):
            if(outputs1[i] != outputs2[i]):
                return False

    
    len_neuronsPerLayer1 = len(neuronsPerLayer1)
    len_neuronsPerLayer2 = len(neuronsPerLayer2)
    if(len_neuronsPerLayer1 != len_neuronsPerLayer2):
        return False
    else:
        for i in range(len_neuronsPerLayer1):
            if(neuronsPerLayer1[i] != neuronsPerLayer2[i]):
                return False

    len_actPerLayer1 = len(actPerLayer1)
    len_actPerLayer2 = len(actPerLayer2)
    if(len_actPerLayer1 != len_actPerLayer2):
        return False
    else:
        for i in range(len_actPerLayer1):
            if(actPerLayer1[i] != actPerLayer2[i]):
                return False

    return True
