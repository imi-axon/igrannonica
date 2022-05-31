import asyncio
import threading
import time

from fastapi import FastAPI, WebSocket

from keras.metrics import *



test = FastAPI()


# ==== Testing Routes ====

@test.post('/post/{s}/{msg}')
def test_post(s: int, msg: str):
    print(f'TEST > POST: message "{msg}"')
    print(f'TEST > POST: sleep for {s}s')
    time.sleep(s)
    print(f'TEST > POST: sleep finished')

@test.websocket("/ws/{s}/{msg}")
async def test_ws(ws: WebSocket, s: int, msg: str):
    await ws.accept()

    print(f'TEST > WS: {msg} sleep for {s}s')
    res = await runb(custom_sleep, 3)
    print(f'TEST > WS: {msg} sleep finished, res "{res}"')
    
    await ws.close()


# Run Blocking (run b)
async def runb(fun, *args):
    return await asyncio.get_event_loop().run_in_executor(None, fun, *args)

def custom_sleep(s=10):
    time.sleep(s)
    return 'Gotovo'




# MAIN

mt = [
    # Regression
    'MeanSquaredError',
    'MeanAbsoluteError',
    'RootMeanSquaredError',
    'MeanAbsolutePercentageError',
    'MeanSquaredLogarithmicError',

    # Classification
    'TruePositives',
    'TrueNegatives',
    'FalsePositives',
    'FalseNegatives',
    'AUC',
    'Recall',
    'Precision',
]

ls = [
    # Regression
    'MeanSquaredError',
    'MeanAbsoluteError',
    'MeanAbsolutePercentageError',
    'MeanSquaredLogarithmicError',
    'CosineSimilarity',
    'Poisson',

    # Classification (Binary)
    'BinaryCrossentropy',
    'Hinge',
    'SquaredHinge',

    # Classification (Multiclass)
    'CategoricalCrossentropy',
    'SparseCategoricalCrossentropy',
    'kullback_leibler_divergence',
]

def fn():
    pass

# for x in mt:
#     if (type(fn))
#     print(type())

# for x in ls:
#     print(type(get(x)))


# print(serialize(TruePositives()))
# print(serialize(MeanSquaredError()))

# x = get(mt[0])
# print(serialize(x()))

print(serialize(mse))
print(serialize(mean_squared_error))
print(serialize(TruePositives()))
# print(serialize(MeanAbsoluteError()))