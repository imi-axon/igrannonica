# Igrannonica  

The project _**Igrannonica**_ consists of several applications that together create a software solution designed to simplify working with neural networks and learning about them.

The solution is made up of three parts, or three separate applications: _**Angular** front end_, _**.NET** back end_, and _**Python** microservice_.


## Required installations for running the applications in a development environment

### Angular app

- Node.js `16.14`
- Angular CLI `13.2.5`

### .NET app

- .NET 6.0
- Visual Studio 2022

### Python app (along with modules)

- Python `3.10`
    - fastapi (`pip install "fastapi[all]"`)
    - tensorflow
    - pandas
    - numpy
    - httpx

### Database

- MariaDB / MySQL


## Setting up the project to run in a development environment

- Download in .zip format or clone the **git** project from the following link: https://gitlab.pmf.kg.ac.rs/igrannonica/axon

### Running the applications

- **Angular**: in the `/src/front/angular` directory, run the application using _AngularCLI_, by typing `ng serve` in the terminal.
- **.NET**: one way to run it is using the _Visual Studio_ (_VS_) IDE. Open the project in _VS_ and run it using the `Build and Run` option.
- **Python**: in the `/src/ml/app` directory, run it using the terminal command `uvicorn main:app --reload` (the `--reload` option is optional).



## Ports
- 10015 - Frontend
- 10016 - Backend
- 10017 - Python microservice
