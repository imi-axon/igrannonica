# %%
import pathlib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

# %%
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

print(tf.__version__)

# %% [markdown]
# Preuzimanje podataka

# %%
dataset_path = keras.utils.get_file("auto-mpg.data", "http://archive.ics.uci.edu/ml/machine-learning-databases/auto-mpg/auto-mpg.data")
dataset_path

# %%
column_names = ['MPG','Cylinders','Displacement','Horsepower','Weight',
                'Acceleration', 'Model Year', 'Origin']
raw_dataset = pd.read_csv(dataset_path, names=column_names,
                      na_values = "?", comment='\t',
                      sep=" ", skipinitialspace=True)
dataset = raw_dataset.copy()
dataset.tail()


# %%
dataset.columns

# %%
dataset.shape #broj redova i broj kolona skupa podataka
dataset.shape[0] # broj redova skupa podataka (ukupan broj podataka po kolonama)

# %% [markdown]
# Sredjivanje podataka

# %% [markdown]
# Skup sadrzi neke podatke koje imaju null vrednosti

# %% [markdown]
# Najcesci nacin rukovanja podacima koje nedostaju je brisanje (dropping) podataka koje imaju vrednosti koje nedostaju ili ubacivanje (imputing) vrednosti koje nedostaju (njihova aproksimacija prosekom).

# %%
dataset.isna().sum()

# %%
dataset = dataset.dropna() #brisanje null vrednosti

# %%
horsepowerKol = dataset['Horsepower'] #popunjavanje null vrednosti mean-om 
horsepower_mean = horsepowerKol.mean()
horsepowerKol.fillna(horsepower_mean,inplace=True)

# %%
dataset.corr() #korelaciona matrica 

# %%
for x in range(dataset.shape[1]) : # za svaku kolonu racuna njenu srednju vrednost
  m = dataset[dataset.columns[x]].mean()
  print(dataset.columns[x] + ':' + str(m))

# %%
for x in range(dataset.shape[1]) : # za svaku kolonu racuna njenu medijanu
  m = dataset[dataset.columns[x]].median()
  print(dataset.columns[x] + ':' + str(m))

# %%
for x in range(dataset.shape[1]) : # za svaku kolonu racuna njen maksimum
  m = dataset[dataset.columns[x]].max()
  print(dataset.columns[x] + ':' + str(m))

# %%
for x in range(dataset.shape[1]) : # za svaku kolonu racuna njen minimum
  m = dataset[dataset.columns[x]].min()
  print(dataset.columns[x] + ':' + str(m))

# %%
#jos neki nacin izracunavanja statistike
stat = dataset.describe().transpose()
stat

# %%
stat['mean']

# %%
print(dataset.Origin.unique()) #prikaz jednistvenih vrednosti u koloni
print(dataset["Origin"].unique())

# %%
dataset['Origin'] = dataset['Origin'].map({1:'USA', 2:'Europe', 3:'Japan'}) #elemente kolone menjamo drugim vrednostima u zavisnosti od mapiranja koje prosledimo

# %%
dataset.head()



# %%
dataset = pd.get_dummies(dataset, prefix='', prefix_sep='') #vrsimo dummy enkodiranje kategorijske promenljive
dataset.tail()

# %% [markdown]
# Podela podataka na trening i test

# %%
train_dataset = dataset.sample(frac=0.8,random_state=0) #80% podataka za treniranje
test_dataset = dataset.drop(train_dataset.index) #ostalih 20% podataka za tesiranje

# %% [markdown]
# Analiza podataka

# %%
sns.pairplot(train_dataset[["MPG", "Cylinders", "Displacement", "Weight"]], diag_kind="kde") #medjusobno uporedjujemo atribute u podacima

# %%
train_stats = train_dataset.describe() #opsta statistika
train_stats.pop("MPG") #ovaj atribut ignorisemo jer je ciljna promenljiva (ona koja se prediktuje)
train_stats = train_stats.transpose()
train_stats

# %%
train_labels = train_dataset.pop('MPG') #izdvajanje ciljne promenljive
test_labels = test_dataset.pop('MPG')

# %%
def norm(x): #standardizacija podataka - podaci su na razlicitim skalama, pa ima smisla izvrsiti njihovu strandardizaciju
  return (x-train_stats['mean']) / train_stats['std'] 
normed_train_data = norm(train_dataset)
normed_test_data = norm(test_dataset)

# %% [markdown]
# Regresioni model

# %% [markdown]
#   Definicija modela
#  
# 
# *   Koriscen je Sequential model ce predstavljati jednu neuronsku mrezu sa propagacijom unapred. Na izlazu ce biti jedan neuron koji ce davati ocenu atributa MPG.
# *   Kao funkciju greske koriscen je MSE (mean squared error).
# *   Koriscen je RMSprop optimizator.
# 
# 
# 
# 
# 
# 
# 

# %%
def build_model():
  model = keras.Sequential([
      layers.Dense(64, activation='relu', input_shape=[len(train_dataset.keys())]),
      layers.Dense(64, activation = 'relu'),
      layers.Dense(2)
  ])

  optimizer = tf.keras.optimizers.RMSprop(0.001)

  model.compile(loss='mean_squared_error',
                optimizer = optimizer,
                metrics=['MeanAbsoluteError','mean_squared_error'])
  return model

# %%
model = build_model()

# %% [markdown]
# Pregled modela

# %%
model.summary() #pomocu f-je summary mozemo pogledati pregled definisanog modela

# %% [markdown]
# Obucavanje modela

# %% [markdown]
# 
# 
# *   Skup za obucavanje cemo podeliti na dva nova skupa, jedan ce biti skup na kome ce se zapravo vrsiti obucavanje (80% originalnog skupa za obucavanje), a validacioni skup cemo koristiti da na kraju svake epohe evaluiramo koliko je dobar nas model.
# *   Obucavacemo model 1000 epoha i cuvacemo tacnost na podacima za obucavanje i validaciju tokom treninga.
# Funkcija *fit* vraca objekat koji sadrzi neophodne podatke.
# 
# 

# %%
EPOCHS = 1000

history = model.fit(
    normed_train_data, train_labels,
    epochs = EPOCHS, validation_split = 0.2, verbose=1)


# %%
plt.plot(history.epoch, history.history['mse'])
plt.plot(history.epoch, history.history['val_mse'])
plt.ylim([0,12])
plt.legend(['Trening MSE', 'Validacioni MSE'])

# %%
hist = pd.DataFrame(history.history) #tabelarni podaci
hist['epoch'] = history.epoch

hist.tail()

# %% [markdown]
# Zakljucak: 1000 epoha je previse i da pustanje obucavanja da toliko dugo traje ne doprinosi tacnosti modela.

# %% [markdown]
# Sad koristimo tehniku Early stopping. Ideja je da se definise skup ogranicenja koja kad se ispune, obucavanje modela ce biti zaustavljeno. Npr. ukoliko se u *k* uzastopnih epoha ne poboljsa vrednost *val_mse* ima smisla zaustaviti obucavanje.

# %%
model = build_model()
#Parametar 'patience' je broj epoha koji se razmatra za zaustavljanje
#Parametar 'monitor' predstavlja meru koja se poredi kroz epohe.
early_stop = keras.callbacks.EarlyStopping(monitor='val_loss', patience=10)

early_history = model.fit(normed_train_data, train_labels, 
                          epochs = EPOCHS, validation_split=0.2, verbose=1, 
                          callbacks=[early_stop])

# %%
plt.plot(early_history.epoch, early_history.history['mae'])
plt.plot(early_history.epoch, early_history.history['val_mae'])
plt.ylim([0,10])
plt.legend(['Trening MAE', 'Validacioni MAE'])
plt.xlabel('Epohe')
plt.ylabel('MAE[MPG]')

# %% [markdown]
# Evaluacija modela

# %% [markdown]
# Ponovo obucavamo model, ali na celokupnim podacima za obucavanje (i trening i validacioni) i taj model cemo koristiti za evaluaciju na test skupu.

# %%
model = build_model()
early_stop_epochs = 53

final_history = model.fit(normed_train_data, train_labels,
                          epochs = early_stop_epochs, verbose=1)

# %% [markdown]
# Pregled kako se model ponasa na skupu za testiranje.

# %%
loss, mae, mse = model.evaluate(normed_test_data, test_labels, verbose=2)

print("Testing set Mean Abs Error {:5.2f} MPG ".format(mae))
print("Testing set Mean Squared Error {:5.2f} MPG ".format(mse))


