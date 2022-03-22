from pydantic import BaseModel


class Dataset (BaseModel):
    dataset: str

class DatasetEditActions (BaseModel):
    actions: str
    data: str