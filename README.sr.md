# Igrannonica

[![English][readme-lang-en-img]][readme-lang-en]
[![Српски][readme-lang-sr-img]][readme-lang-sr]

Projekat _**Igrannonica**_ se sastoji iz nekoliko aplikacija koje zajedno čine softversko rešenje čija je namena olakša rad sa neuronskim mrežama i učenje o njima.

Rešenje se sastoji iz 3 dela, odnosno 3 odvojene aplikacije, _**Angular** front end_, _**.NET** back end_ i _**Python** mikroservis_.


## Potrebno imati instalirano za pokretanje aplikacija u okruženju za razvoj

### Angular app

- Node.js `16.14`
- Angular CLI `13.2.5`

### .NET app

- .NET 6.0
- Visual Studio 2022

### Python app (zajedno sa modulima)

- Python `3.10`
    - fastapi (`pip install "fastapi[all]"`)
    - tensorflow
    - pandas
    - numpy
    - httpx

### Baza podataka

- MariaDB / MySQL


## Postavljanje projekta za pokretanje u okruženju za razvoj

- Preuzeti u zip formatu **.zip** ili klonirati **git** projekat na sledecem linku: https://gitlab.pmf.kg.ac.rs/igrannonica/axon

### Pokretanje aplikacija

- **Angular**, u direktorijumu `/src/front/angular` pokrenuti pomocu _AngularCLI_ aplikacije, u terminalu otkucati `ng serve`
- **.NET**, jedan nacin je pokretanje pomocu _Visual Studio_ (_VS_) IDE-a. Otvoriti projekat u _VS_-u i pokrenuti pomocu `Build and Run` opcije.
- **Python**, u direktorijumu `/src/ml/app` pokrenuti pomocu komande u terminalu `uvicorn main:app --reload` (opcija `--reload` je opciona)



## Portovi
- 10015 - Frontend
- 10016 - Backend
- 10017 - Python mikroservis


[//]: # (-------------Section for references-------------)

[readme-lang-en]: https://github.com/imi-axon/igrannonica/blob/master/README.md
[readme-lang-en-img]: https://img.shields.io/badge/language-English-blue

[readme-lang-sr]: https://github.com/imi-axon/igrannonica/blob/master/README.sr.md
[readme-lang-sr-img]: https://img.shields.io/badge/language-%D0%A1%D1%80%D0%BF%D1%81%D0%BA%D0%B8%20-red
