from typing import List
from fastapi import WebSocket
from pydantic import BaseModel

# privremeno !!!
class TempTrainingInstance():
    def __init__(self):
        self.data: List[int] = [i for i in range(1,100)]

    async def get_data(self) -> str | None:
        return str(self.data.pop()) if len(self.data) > 0 else None
# ----------

class Dataset (BaseModel):
    dataset: str

class Statistics (BaseModel):
    statistics: str

class DatasetEditActions (BaseModel):
    actions: str
    dataset: str    # link
    metapath: str   # link

class TrainingRequest (BaseModel):
    dataset: str    # link
    nn: str         # link
    conf: str       # link
    trainrez: str   # link
    newconf: str

class MetaGenRequest (BaseModel):
    dataset: str    # link
    metamain: str   # link
    metaedit: str   # link

class NNCreate (BaseModel):
    headers: str
    nn: str
    conf: str

class NNOnly (BaseModel):
    nn: str

class WsConn():

    def __init__(self, ws: WebSocket, tr: TempTrainingInstance):
        self.ws: WebSocket = ws
        self.tr: TempTrainingInstance = tr
