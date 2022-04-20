#!/bin/bash

cd /home/Axon/prod

# Back
cd back/app
rm appsettings.json
cp appsettings.production.json appsettings.json
chmod 777 BackApi
screen -dmS back ./BackApi

cd ../..

# Front
cd front
screen -dmS front node server.js

cd ..

# ML
cd ml/app
screen -dmS ml uvicorn main:app --port 10017




# Front - Za light-server
#cd ../front/app
#screen -dmS front npx lite-server -c ../server/cfg.json
