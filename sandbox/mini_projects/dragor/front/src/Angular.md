# Uputstvo

## Instalacija

### Potreban softver:
- Node.js
- Node Packae Manager (NPM)
- Angular CLI (Command Line Interface)

### Node.js i NPM
Node.js je moguce skinuti sa zvanicnog sajta https://nodejs.org. Kada se instalira Node.js takodje se instalira i NPM

### Angular CLI
Angular CLI se instalira koriscenjem NPM-a iz terminala komandom `npm install -g @angular/cli`.
Nakon sto je Angular CLI instaliran dostupan je za koriscenje iz terminala komandom `ng`

## Kreiranje projekta

Porjekat se kreira komandom `ng new naziv-projekta`. Da bi se izbeglo kreiranje novog repozitorijuma prilikom generisanja projekta dodaje se opcija `--skip-git` (`.gitignore` fajl ce svakako biti kreiran), pa komanda za generisanje izgleda ovako `ng new --skip-git naziv-projekta`.

# Reference

## Template bindings

### Output data
`<div> {{ vrednost }} </div>`

### Input data
`<div [promenljiva]="vrednost"> </div>`

### Events
`<div (event)="pozivnaFunkcija()"> </div>`

