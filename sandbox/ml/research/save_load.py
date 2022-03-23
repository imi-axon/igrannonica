import pathlib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

dataset_path = keras.utils.get_file("auto-mpg.data", "http://archive.ics.uci.edu/ml/machine-learning-databases/auto-mpg/auto-mpg.data")
dataset_path
column_names = ['MPG','Cylinders','Displacement','Horsepower','Weight',
                'Acceleration', 'Model Year', 'Origin']
raw_dataset = pd.read_csv(dataset_path, names=column_names,
                      na_values = "?", comment='\t',
                      sep=" ", skipinitialspace=True)
dataset = raw_dataset.copy()
dataset.tail()
dataset = dataset.dropna()
dataset['Origin'] = dataset['Origin'].map({1:'USA', 2:'Europe', 3:'Japan'})
dataset = pd.get_dummies(dataset, prefix='', prefix_sep='')

train_dataset = dataset.sample(frac=0.8,random_state=0) #80% podataka za treniranje
test_dataset = dataset.drop(train_dataset.index) #ostalih 20% podataka za tesiranje

train_labels = train_dataset.pop('MPG') #izdvajanje ciljne promenljive
test_labels = test_dataset.pop('MPG')

train_stats = train_dataset.describe() #opsta statistika
# train_stats.pop("MPG") #ovaj atribut ignorisemo jer je ciljna promenljiva (ona koja se prediktuje)
train_stats = train_stats.transpose()
train_stats

def norm(x): #standardizacija podataka - podaci su na razlicitim skalama, pa ima smisla izvrsiti njihovu strandardizaciju
  return (x-train_stats['mean']) / train_stats['std'] 
normed_train_data = norm(train_dataset)
normed_test_data = norm(test_dataset)


def build_model():
  model = keras.Sequential([
      layers.Dense(64, activation='relu', input_shape=[len(train_dataset.keys())]),
      layers.Dense(64, activation = 'relu'),
      layers.Dense(1)
  ])

  optimizer = tf.keras.optimizers.RMSprop(0.001)

  model.compile(loss='mse',
                optimizer = optimizer,
                metrics=['mae','mse'])
  return model


model = build_model()
model.summary()


early_stop_epochs = 53

final_history = model.fit(normed_train_data, train_labels,
                          epochs = early_stop_epochs, verbose=1)


loss, mae, mse = model.evaluate(normed_test_data, test_labels, verbose=2)

print("Testing set Mean Abs Error {:5.2f} MPG ".format(mae))
print("Testing set Mean Squared Error {:5.2f} MPG ".format(mse))

#Cuvanje i ucitavanje sacuvanog modela

model.save('my_model.h5')

new_model = tf.keras.models.load_model('my_model.h5')

new_model.summary()

new_loss, new_mae, new_mse = new_model.evaluate(normed_test_data, test_labels, verbose=2)
print("Testing set Mean Abs Error {:5.2f} MPG ".format(new_mae))
print("Testing set Mean Squared Error {:5.2f} MPG ".format(new_mse))
