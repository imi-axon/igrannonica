import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { Zadatak } from 'src/app/ZadModel';

@Component({
  selector: 'app-forma',
  templateUrl: './forma.component.html',
  styleUrls: ['./forma.component.css']
})
export class FormaComponent implements OnInit {
  @Output() dodajNovi: EventEmitter<Zadatak> = new EventEmitter();
  dan:string;
  vreme:string;
  naziv:string;
  opis:string;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(){

    const novi={
      dan:this.dan,
      vreme:this.vreme,
      naziv:this.naziv,
      opis:this.opis
    }

    this.dodajNovi.emit(novi);

    //resetuje vrednosti nakon unosa
    this.dan="";
    this.vreme="";
    this.naziv="";
    this.opis="";
  }
}
