echo "Skriptu je potrebno pokrenuti iz root direktorijuma projekta!"
echo "Pre pokretanja ove skripte pripremiti direktorijume na serveru! (u /home/Axon/prod/ je potrebno da postoje prazni front, back i ml direktorijumi)"
echo "Nastaviti sa pokretanjem skripte? (yes/no)"

read proceedYN

if [ "$proceedYN" == "y" -o "$proceedYN" == "Y" ]
then
    exit 1
fi

echo ""

if [ "$1" == "all" -o "$1" == "f" -o "$2" == "f" -o "$3" == "f" ]
then
    echo "Deploying Front..."
    scp -r src/front/angular/dist/angular Axon@softeng.pmf.kg.ac.rs:/home/Axon/prod/front/app
    echo "Done."; echo ""
fi

if [ "$1" == "all" -o "$1" == "b" -o "$2" == "b" -o "$3" == "b" ]
then
    echo "Deploying Back..."
    scp -r src/back/BackApi/BackApi/bin/MyRelease Axon@softeng.pmf.kg.ac.rs:/home/Axon/prod/back/app
    echo "Done."; echo ""
fi

if [ "$1" == "all" -o "$1" == "m" -o "$2" == "m" -o "$3" == "m" ]
then
    echo "Deploying ML..."
    scp -r src/ml/app Axon@softeng.pmf.kg.ac.rs:/home/Axon/prod/ml/app
    echo "Done."; echo ""
fi

if [ "$1" == "srv" -o "$2" == "srv" ]
then
    echo "Deploying JS Server..."
    scp sandbox/server/server.js Axon@softeng.pmf.kg.ac.rs:/home/Axon/prod/front
    echo "Done."; echo ""
fi

if [ "$1" == "sql" -o "$2" == "sql" ]
then
    read sqlname
    echo "Deploying JS Server..."
    scp "src/back/BackApi/BackApi/obj/Debug/net6.0/$sqlname.sql" Axon@softeng.pmf.kg.ac.rs:/home/Axon/prod/latest.sql
    echo "Done."; echo ""
fi

# src\back\BackApi\BackApi\obj\Debug\net6.0