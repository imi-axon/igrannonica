scp -r src/back/BackApi/BackApi/bin/MyRelease Axon@softeng.pmf.kg.ac.rs:/home/Axon/prod/back/app
scp -r src/front/angular/dist/angular Axon@softeng.pmf.kg.ac.rs:/home/Axon/prod/front/app
scp -r src/ml/app Axon@softeng.pmf.kg.ac.rs:/home/Axon/prod/ml/app

scp sandbox/server/server.js Axon@softeng.pmf.kg.ac.rs:/home/Axon/prod/front
