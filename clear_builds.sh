if [[ -d ./src/front/angular/dist/angular ]]
then
	echo 'Ciscenje front dist direktorijuma...'
	rm -r ./src/front/angular/dist/angular
	echo 'OK'
fi


if [[ -d ./src/back/BackApi/BackApi/bin/MyRelease ]]
then
	echo 'Ciscenje back MyRelease direktorijuma...'
	rm -r ./src/back/BackApi/BackApi/bin/MyRelease/*
	echo 'OK'
fi

echo 'Zavrseno.'
