Cuvanje i ucitavanje mreze

Keras nam omogucava da cuvamo i ucitavamo mreze na jednostavan nacin putem funckija save i load. 

! mkdir models

model_path = 'models/network.h5'
model.save(model_path)

! ls models

Ova datoteka sa moze negde sacuvati i iskoristiti da se instancira mreza. Datoteka se cuva sa ekstenzijom .h5.
Vazno je napomenuti da save cuva arhitekturu mreze, tezine mreze, kao i informacije koje su prosledjene tokom kompilacije mreze (compile).

new_model = tf.keras.models.load_model(model_path)
new_model.summary()

https://www.tensorflow.org/tutorials/keras/save_and_load
https://www.tensorflow.org/guide/keras/save_and_serialize

Cuvanje mreze tokom obucavanja
Tokom obucavanja mreze, mozda zelimo da se sacuvaju razne verzije mreze jer nam moze biti korisno da rekonstruisemo neku verziju mreze.

Keras nudi ModelCheckpoint funkcionalnost (eng. callback) koja omogucava da se tokom treninga sacuva trenutna verzija modela.

https://www.tensorflow.org/api_docs/python/tf/keras/callbacks/ModelCheckpoint